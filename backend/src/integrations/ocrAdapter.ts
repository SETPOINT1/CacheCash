export async function analyzeReceipt(fileUrl: string) {
  return {
    confidence: 0.91,
    fileUrl,
    merchantName: "Sample Vendor",
    receiptDate: "2026-04-18",
    totalAmount: 3850,
  };
}
