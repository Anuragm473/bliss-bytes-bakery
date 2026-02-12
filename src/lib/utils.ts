export function formatCurrency(amount: number) {
  return `₹${amount}`;
}

export function isSameDayAvailable() {
  const now = new Date();
  return now.getHours() < 16;
}

export function generateOrderId() {
  return `BB-${Date.now()}`;
}
