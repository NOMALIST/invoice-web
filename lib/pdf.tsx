// PDF 생성 헬퍼
// @react-pdf/renderer를 사용해 견적서 PDF 레이아웃을 정의합니다
// 이 모듈은 서버 사이드(API Route)에서만 사용됩니다

import path from "node:path";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";

// 한글 지원 폰트 등록 (모듈 레벨 1회 실행)
Font.register({
  family: "NotoSansKR",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansKR-Regular-subset.ttf"),
      fontWeight: "normal",
    },
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansKR-Bold-subset.ttf"),
      fontWeight: "bold",
    },
  ],
});

// PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "NotoSansKR",
    color: "#111827",
  },
  title: {
    fontSize: 24,
    fontFamily: "NotoSansKR",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "NotoSansKR",
    color: "#6B7280",
    marginBottom: 24,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  infoBlock: {
    flexDirection: "column",
    gap: 4,
  },
  infoLabel: {
    fontSize: 8,
    fontFamily: "NotoSansKR",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontFamily: "NotoSansKR",
    fontWeight: "bold",
  },
  infoValueSmall: {
    fontSize: 10,
    fontFamily: "NotoSansKR",
  },
  statusBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: "NotoSansKR",
  },
  // 테이블
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 2, textAlign: "right" },
  colAmount: { flex: 2, textAlign: "right" },
  headerText: {
    fontSize: 8,
    fontFamily: "NotoSansKR",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  // 합계
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "NotoSansKR",
    fontWeight: "bold",
    marginRight: 24,
  },
  totalValue: {
    fontSize: 11,
    fontFamily: "NotoSansKR",
    fontWeight: "bold",
  },
});

/** 숫자를 한국 원화 형식으로 포맷 */
function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

/** 날짜 문자열을 간단한 형식으로 포맷 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return dateStr.replace(/-/g, "/");
}

interface InvoicePDFProps {
  invoice: Invoice;
}

/** 견적서 PDF 문서 컴포넌트 */
export function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Document title={`견적서 ${invoice.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <Text style={styles.title}>견적서</Text>
        <Text style={styles.subtitle}>No. {invoice.invoiceNumber}</Text>

        <View style={styles.divider} />

        {/* 정보 그리드 */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>수신</Text>
            <Text style={styles.infoValue}>{invoice.clientName}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>발행일</Text>
            <Text style={styles.infoValueSmall}>{formatDate(invoice.issueDate)}</Text>
            <Text style={[styles.infoLabel, { marginTop: 8 }]}>유효기간</Text>
            <Text style={styles.infoValueSmall}>{formatDate(invoice.validUntil)}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>상태</Text>
            <Text style={styles.statusBadge}>{invoice.status}</Text>
          </View>
        </View>

        {/* 견적 항목 테이블 */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colDescription]}>항목</Text>
          <Text style={[styles.headerText, styles.colQty]}>수량</Text>
          <Text style={[styles.headerText, styles.colPrice]}>단가</Text>
          <Text style={[styles.headerText, styles.colAmount]}>금액</Text>
        </View>

        {invoice.items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{formatKRW(item.unitPrice)}</Text>
            <Text style={styles.colAmount}>{formatKRW(item.amount)}</Text>
          </View>
        ))}

        {/* 합계 */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>합계</Text>
          <Text style={styles.totalValue}>{formatKRW(invoice.totalAmount)}</Text>
        </View>
      </Page>
    </Document>
  );
}
