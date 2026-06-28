import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { Invoice } from "@/types/invoice";

// 환경변수 주입
process.env.NOTION_API_KEY = "test-api-key";
process.env.NOTION_DATABASE_ID = "test-db-id";

// getInvoice와 renderToBuffer를 mock 처리
vi.mock("@/lib/notion", () => ({
  getInvoice: vi.fn(),
}));

vi.mock("@react-pdf/renderer", () => ({
  renderToBuffer: vi.fn(),
}));

vi.mock("@/lib/pdf", () => ({
  InvoicePDF: vi.fn(() => null),
}));

const { POST } = await import("@/app/api/generate-pdf/route");
const { getInvoice } = await import("@/lib/notion");
const { renderToBuffer } = await import("@react-pdf/renderer");

const mockInvoice: Invoice = {
  id: "invoice-id-001",
  invoiceNumber: "INV-001",
  clientName: "홍길동",
  issueDate: "2026-06-01",
  validUntil: "2026-07-01",
  status: "대기",
  totalAmount: 1000000,
  items: [],
};

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/generate-pdf", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/generate-pdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("정상 요청 시 PDF 바이너리를 반환한다", async () => {
    vi.mocked(getInvoice).mockResolvedValue(mockInvoice);
    vi.mocked(renderToBuffer).mockResolvedValue(
      Buffer.from("pdf-content") as unknown as Buffer
    );

    const req = makeRequest({ invoiceId: "invoice-id-001" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain("attachment");
  });

  it("invoiceId 미전달 시 400을 반환한다", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("invoiceId");
  });

  it("견적서를 찾을 수 없으면 404를 반환한다", async () => {
    vi.mocked(getInvoice).mockResolvedValue(null);

    const req = makeRequest({ invoiceId: "non-existent" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toContain("찾을 수 없습니다");
  });

  it("PDF 생성 중 오류 발생 시 500을 반환한다", async () => {
    vi.mocked(getInvoice).mockResolvedValue(mockInvoice);
    vi.mocked(renderToBuffer).mockRejectedValue(new Error("PDF render error"));

    const req = makeRequest({ invoiceId: "invoice-id-001" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toContain("오류");
  });
});
