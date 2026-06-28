import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// NOTION_API_KEY 환경변수를 모듈 로드 전에 주입
process.env.NOTION_API_KEY = "test-api-key";
process.env.NOTION_DATABASE_ID = "test-db-id";

// 모듈을 동적으로 import (환경변수 주입 이후에 로드해야 함)
const { getInvoiceList } = await import("@/lib/notion");

const makeNotionPage = (overrides: Record<string, unknown> = {}) => ({
  id: "page-id-001",
  properties: {
    invoice_number: { title: [{ plain_text: "INV-001" }] },
    client_name: { rich_text: [{ plain_text: "홍길동" }] },
    issue_date: { date: { start: "2026-06-01" } },
    status: { select: { name: "대기" } },
    total_amount: { number: 1000000 },
    ...overrides,
  },
});

describe("getInvoiceList()", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("정상 응답 시 InvoiceListItem 배열을 반환한다", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [makeNotionPage()] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await getInvoiceList();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "page-id-001",
      invoiceNumber: "INV-001",
      clientName: "홍길동",
      issueDate: "2026-06-01",
      status: "대기",
      totalAmount: 1000000,
    });
  });

  it("Notion API 오류(res.ok=false) 시 빈 배열을 반환한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
    );

    const result = await getInvoiceList();
    expect(result).toEqual([]);
  });

  it("fetch 예외 발생 시 빈 배열을 반환한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network Error"))
    );

    const result = await getInvoiceList();
    expect(result).toEqual([]);
  });

  it("results가 빈 배열이면 빈 배열을 반환한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      })
    );

    const result = await getInvoiceList();
    expect(result).toEqual([]);
  });

  it("속성값 누락 시 기본값으로 채운다", async () => {
    const pageWithMissingProps = {
      id: "page-id-002",
      properties: {},
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [pageWithMissingProps] }),
      })
    );

    const result = await getInvoiceList();
    expect(result[0]).toMatchObject({
      id: "page-id-002",
      invoiceNumber: "",
      clientName: "",
      issueDate: "",
      status: "대기",
      totalAmount: 0,
    });
  });
});
