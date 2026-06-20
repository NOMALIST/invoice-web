// 견적서 시스템 타입 정의
// Notion 데이터베이스 스키마와 매핑되는 도메인 타입

/** 견적서 항목 (Items DB) */
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

/** 견적서 상태 */
export type InvoiceStatus = '대기' | '승인' | '거절'

/** 견적서 (Invoices DB) */
export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  issueDate: string
  validUntil: string
  status: InvoiceStatus
  totalAmount: number
  items: InvoiceItem[]
}
