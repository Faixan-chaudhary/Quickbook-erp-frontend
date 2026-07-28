export const company = {
  name: "Meridian Technologies",
  legalName: "Meridian Technologies Inc.",
  industry: "Software & Technology",
  country: "United States",
  currency: "USD",
  fiscalYear: "January - December",
  taxId: "47-3829104",
  website: "meridiantech.io",
  phone: "+1 (415) 882-4400",
  email: "finance@meridiantech.io",
  address: "100 California Street, Suite 1200, San Francisco, CA 94111",
  logo: null,
}

export const user = {
  name: "Jordan Avery",
  email: "jordan@meridiantech.io",
  role: "CFO",
  avatar: null,
}

export const customers = [
  { id: "C001", name: "Apex Dynamics Corp", email: "billing@apexdynamics.com", phone: "+1 (212) 555-0101", country: "US", city: "New York", balance: 48200, status: "active", totalInvoiced: 284000, lastPayment: "2024-11-28", creditLimit: 100000 },
  { id: "C002", name: "Luminary Solutions", email: "ap@luminary.io", phone: "+1 (415) 555-0142", country: "US", city: "San Francisco", balance: 12500, status: "active", totalInvoiced: 156000, lastPayment: "2024-11-15", creditLimit: 50000 },
  { id: "C003", name: "Nexus Enterprises", email: "finance@nexusent.com", phone: "+44 20 7946 0958", country: "UK", city: "London", balance: 0, status: "active", totalInvoiced: 94200, lastPayment: "2024-11-30", creditLimit: 75000 },
  { id: "C004", name: "Quantum Ventures", email: "accounts@quantumv.co", phone: "+1 (512) 555-0189", country: "US", city: "Austin", balance: 31800, status: "overdue", totalInvoiced: 211000, lastPayment: "2024-10-12", creditLimit: 60000 },
  { id: "C005", name: "Cascade Industries", email: "billing@cascadeind.com", phone: "+1 (206) 555-0223", country: "US", city: "Seattle", balance: 8900, status: "active", totalInvoiced: 73500, lastPayment: "2024-11-22", creditLimit: 40000 },
  { id: "C006", name: "Orion Digital Ltd", email: "finance@oriondigital.co.uk", phone: "+44 20 7946 1234", country: "UK", city: "Manchester", balance: 22400, status: "active", totalInvoiced: 165000, lastPayment: "2024-11-18", creditLimit: 80000 },
  { id: "C007", name: "Titanium Capital Partners", email: "ap@titaniumcp.com", phone: "+1 (646) 555-0267", country: "US", city: "New York", balance: 156000, status: "overdue", totalInvoiced: 820000, lastPayment: "2024-09-30", creditLimit: 200000 },
  { id: "C008", name: "Solaris Group", email: "billing@solarisgroup.eu", phone: "+49 30 12345678", country: "DE", city: "Berlin", balance: 4200, status: "active", totalInvoiced: 52000, lastPayment: "2024-11-25", creditLimit: 30000 },
  { id: "C009", name: "Harbinger Analytics", email: "finance@harbinger.ai", phone: "+1 (617) 555-0334", country: "US", city: "Boston", balance: 0, status: "inactive", totalInvoiced: 38400, lastPayment: "2024-08-15", creditLimit: 25000 },
  { id: "C010", name: "Vantage Point Media", email: "accounts@vpointmedia.com", phone: "+1 (310) 555-0445", country: "US", city: "Los Angeles", balance: 17600, status: "active", totalInvoiced: 124000, lastPayment: "2024-11-10", creditLimit: 45000 },
  { id: "C011", name: "Ironclad Logistics", email: "billing@ironclad.com", phone: "+1 (404) 555-0512", country: "US", city: "Atlanta", balance: 9100, status: "active", totalInvoiced: 89500, lastPayment: "2024-11-20", creditLimit: 35000 },
  { id: "C012", name: "Blue Ridge Software", email: "ap@blueridge.dev", phone: "+1 (828) 555-0678", country: "US", city: "Asheville", balance: 3400, status: "active", totalInvoiced: 47200, lastPayment: "2024-11-27", creditLimit: 20000 },
]

export const vendors = [
  { id: "V001", name: "AWS (Amazon Web Services)", email: "billing@aws.amazon.com", category: "Cloud Infrastructure", balance: 28400, status: "active", totalSpend: 342000, paymentTerms: "Net 30", lastBill: "2024-11-30" },
  { id: "V002", name: "Salesforce Inc.", email: "billing@salesforce.com", category: "CRM Software", balance: 14200, status: "active", totalSpend: 168000, paymentTerms: "Net 30", lastBill: "2024-11-01" },
  { id: "V003", name: "WeWork (Office Lease)", email: "billing@wework.com", category: "Office & Facilities", balance: 9800, status: "active", totalSpend: 117600, paymentTerms: "Monthly", lastBill: "2024-12-01" },
  { id: "V004", name: "Stripe Inc.", email: "billing@stripe.com", category: "Payment Processing", balance: 3200, status: "active", totalSpend: 38400, paymentTerms: "Monthly", lastBill: "2024-11-30" },
  { id: "V005", name: "Adobe Inc.", email: "billing@adobe.com", category: "Design Software", balance: 1800, status: "active", totalSpend: 21600, paymentTerms: "Annual", lastBill: "2024-01-01" },
  { id: "V006", name: "Datadog Inc.", email: "billing@datadoghq.com", category: "Monitoring", balance: 6400, status: "active", totalSpend: 76800, paymentTerms: "Net 30", lastBill: "2024-11-30" },
  { id: "V007", name: "GitLab Inc.", email: "billing@gitlab.com", category: "Dev Tools", balance: 2100, status: "active", totalSpend: 25200, paymentTerms: "Annual", lastBill: "2024-06-01" },
  { id: "V008", name: "Morgan Office Supplies", email: "orders@morganoffice.com", category: "Office Supplies", balance: 840, status: "active", totalSpend: 10080, paymentTerms: "Net 15", lastBill: "2024-11-22" },
]

export const invoices = [
  { id: "INV-2024-0847", customer: "Apex Dynamics Corp", customerId: "C001", amount: 24000, tax: 1920, total: 25920, status: "overdue", dueDate: "2024-11-15", issueDate: "2024-10-15", paidDate: null, items: 3, currency: "USD" },
  { id: "INV-2024-0846", customer: "Luminary Solutions", customerId: "C002", amount: 12500, tax: 1000, total: 13500, status: "sent", dueDate: "2024-12-10", issueDate: "2024-11-10", paidDate: null, items: 2, currency: "USD" },
  { id: "INV-2024-0845", customer: "Nexus Enterprises", customerId: "C003", amount: 38200, tax: 0, total: 38200, status: "paid", dueDate: "2024-11-30", issueDate: "2024-11-01", paidDate: "2024-11-28", items: 5, currency: "USD" },
  { id: "INV-2024-0844", customer: "Quantum Ventures", customerId: "C004", amount: 18900, tax: 1512, total: 20412, status: "overdue", dueDate: "2024-11-01", issueDate: "2024-10-01", paidDate: null, items: 2, currency: "USD" },
  { id: "INV-2024-0843", customer: "Cascade Industries", customerId: "C005", amount: 8900, tax: 712, total: 9612, status: "paid", dueDate: "2024-11-22", issueDate: "2024-10-22", paidDate: "2024-11-20", items: 1, currency: "USD" },
  { id: "INV-2024-0842", customer: "Orion Digital Ltd", customerId: "C006", amount: 22400, tax: 4480, total: 26880, status: "sent", dueDate: "2024-12-18", issueDate: "2024-11-18", paidDate: null, items: 4, currency: "GBP" },
  { id: "INV-2024-0841", customer: "Titanium Capital Partners", customerId: "C007", amount: 156000, tax: 0, total: 156000, status: "overdue", dueDate: "2024-10-31", issueDate: "2024-09-30", paidDate: null, items: 8, currency: "USD" },
  { id: "INV-2024-0840", customer: "Vantage Point Media", customerId: "C010", amount: 17600, tax: 1408, total: 19008, status: "viewed", dueDate: "2024-12-10", issueDate: "2024-11-10", paidDate: null, items: 3, currency: "USD" },
  { id: "INV-2024-0839", customer: "Ironclad Logistics", customerId: "C011", amount: 9100, tax: 728, total: 9828, status: "paid", dueDate: "2024-11-20", issueDate: "2024-10-20", paidDate: "2024-11-19", items: 2, currency: "USD" },
  { id: "INV-2024-0838", customer: "Blue Ridge Software", customerId: "C012", amount: 3400, tax: 272, total: 3672, status: "draft", dueDate: "2024-12-27", issueDate: "2024-11-27", paidDate: null, items: 1, currency: "USD" },
  { id: "INV-2024-0837", customer: "Apex Dynamics Corp", customerId: "C001", amount: 31000, tax: 2480, total: 33480, status: "paid", dueDate: "2024-11-01", issueDate: "2024-10-01", paidDate: "2024-10-29", items: 4, currency: "USD" },
  { id: "INV-2024-0836", customer: "Solaris Group", customerId: "C008", amount: 4200, tax: 798, total: 4998, status: "paid", dueDate: "2024-11-25", issueDate: "2024-10-25", paidDate: "2024-11-24", items: 1, currency: "EUR" },
]

export const bills = [
  { id: "BILL-2024-0341", vendor: "AWS (Amazon Web Services)", vendorId: "V001", amount: 28400, status: "overdue", dueDate: "2024-11-30", issueDate: "2024-11-01", paidDate: null, category: "Cloud Infrastructure" },
  { id: "BILL-2024-0340", vendor: "Salesforce Inc.", vendorId: "V002", amount: 14200, status: "pending", dueDate: "2024-12-01", issueDate: "2024-11-01", paidDate: null, category: "CRM Software" },
  { id: "BILL-2024-0339", vendor: "WeWork (Office Lease)", vendorId: "V003", amount: 9800, status: "paid", dueDate: "2024-12-01", issueDate: "2024-11-25", paidDate: "2024-11-28", category: "Office & Facilities" },
  { id: "BILL-2024-0338", vendor: "Datadog Inc.", vendorId: "V006", amount: 6400, status: "pending", dueDate: "2024-12-10", issueDate: "2024-11-10", paidDate: null, category: "Monitoring" },
  { id: "BILL-2024-0337", vendor: "Stripe Inc.", vendorId: "V004", amount: 3200, status: "paid", dueDate: "2024-11-30", issueDate: "2024-11-01", paidDate: "2024-11-29", category: "Payment Processing" },
  { id: "BILL-2024-0336", vendor: "GitLab Inc.", vendorId: "V007", amount: 2100, status: "paid", dueDate: "2024-11-15", issueDate: "2024-11-01", paidDate: "2024-11-14", category: "Dev Tools" },
  { id: "BILL-2024-0335", vendor: "Morgan Office Supplies", vendorId: "V008", amount: 840, status: "pending", dueDate: "2024-12-07", issueDate: "2024-11-22", paidDate: null, category: "Office Supplies" },
]

export const expenses = [
  { id: "EXP-2024-1142", description: "Flight NYC → SFO (Q4 Summit)", amount: 842, category: "Travel", employee: "Jordan Avery", date: "2024-11-28", status: "approved", receipt: true },
  { id: "EXP-2024-1141", description: "Client dinner – Apex Dynamics", amount: 394, category: "Meals & Entertainment", employee: "Marcus Chen", date: "2024-11-26", status: "approved", receipt: true },
  { id: "EXP-2024-1140", description: "Hotel – Marriott NYC (3 nights)", amount: 1248, category: "Travel", employee: "Jordan Avery", date: "2024-11-25", status: "approved", receipt: true },
  { id: "EXP-2024-1139", description: "AWS training course", amount: 299, category: "Training & Development", employee: "Priya Sharma", date: "2024-11-22", status: "pending", receipt: false },
  { id: "EXP-2024-1138", description: "Office supplies – standing desk mat", amount: 89, category: "Office Supplies", employee: "Alex Rivera", date: "2024-11-21", status: "approved", receipt: true },
  { id: "EXP-2024-1137", description: "SaaStr Conference ticket", amount: 1299, category: "Conferences", employee: "Sam Okafor", date: "2024-11-20", status: "pending", receipt: true },
  { id: "EXP-2024-1136", description: "Uber rides – client meetings", amount: 178, category: "Travel", employee: "Marcus Chen", date: "2024-11-19", status: "approved", receipt: true },
  { id: "EXP-2024-1135", description: "Team lunch – Q4 planning", amount: 521, category: "Meals & Entertainment", employee: "Jordan Avery", date: "2024-11-18", status: "approved", receipt: true },
  { id: "EXP-2024-1134", description: "Notion Pro subscription", amount: 48, category: "Software", employee: "Taylor Kim", date: "2024-11-15", status: "approved", receipt: false },
  { id: "EXP-2024-1133", description: "Figma Professional plan", amount: 45, category: "Software", employee: "Dev Team", date: "2024-11-14", status: "approved", receipt: false },
]

export const transactions = [
  { id: "TXN-001", date: "2024-11-30", description: "Payment – Nexus Enterprises INV-2024-0845", amount: 38200, type: "credit", category: "Revenue", account: "Operating Checking", balance: 892340, reconciled: true },
  { id: "TXN-002", date: "2024-11-29", description: "Stripe Inc. BILL-2024-0337", amount: -3200, type: "debit", category: "Payment Processing", account: "Operating Checking", balance: 854140, reconciled: true },
  { id: "TXN-003", date: "2024-11-28", description: "WeWork Office Rent – December", amount: -9800, type: "debit", category: "Office & Facilities", account: "Operating Checking", balance: 857340, reconciled: true },
  { id: "TXN-004", date: "2024-11-28", description: "Payment – Cascade Industries INV-2024-0843", amount: 9612, type: "credit", category: "Revenue", account: "Operating Checking", balance: 867140, reconciled: true },
  { id: "TXN-005", date: "2024-11-27", description: "Payroll Run #24 – November 2024", amount: -184200, type: "debit", category: "Payroll", account: "Payroll Checking", balance: 857528, reconciled: true },
  { id: "TXN-006", date: "2024-11-25", description: "AWS Cloud Services – November", amount: -28400, type: "debit", category: "Cloud Infrastructure", account: "Operating Checking", balance: 1041728, reconciled: false },
  { id: "TXN-007", date: "2024-11-24", description: "Payment – Solaris Group INV-2024-0836", amount: 4998, type: "credit", category: "Revenue", account: "Operating Checking", balance: 1070128, reconciled: true },
  { id: "TXN-008", date: "2024-11-22", description: "Salesforce CRM License", amount: -14200, type: "debit", category: "CRM Software", account: "Operating Checking", balance: 1065130, reconciled: true },
  { id: "TXN-009", date: "2024-11-20", description: "Payment – Ironclad Logistics INV-2024-0839", amount: 9828, type: "credit", category: "Revenue", account: "Operating Checking", balance: 1079330, reconciled: true },
  { id: "TXN-010", date: "2024-11-19", description: "GitLab Enterprise – Q4", amount: -2100, type: "debit", category: "Dev Tools", account: "Operating Checking", balance: 1069502, reconciled: true },
  { id: "TXN-011", date: "2024-11-18", description: "Datadog monitoring – November", amount: -6400, type: "debit", category: "Monitoring", account: "Operating Checking", balance: 1071602, reconciled: true },
  { id: "TXN-012", date: "2024-11-15", description: "Payment – Apex Dynamics INV-2024-0837", amount: 33480, type: "credit", category: "Revenue", account: "Operating Checking", balance: 1078002, reconciled: true },
]

export const accounts = [
  { id: "ACC-001", name: "Operating Checking", institution: "Silicon Valley Bank", type: "checking", balance: 892340, lastSync: "2 minutes ago", status: "connected", number: "****8472" },
  { id: "ACC-002", name: "Payroll Checking", institution: "Silicon Valley Bank", type: "checking", balance: 184200, lastSync: "2 minutes ago", status: "connected", number: "****2910" },
  { id: "ACC-003", name: "Business Savings", institution: "Mercury Bank", type: "savings", balance: 1250000, lastSync: "5 minutes ago", status: "connected", number: "****5531" },
  { id: "ACC-004", name: "Business Visa Card", institution: "Brex", type: "credit", balance: -42180, lastSync: "1 hour ago", status: "connected", number: "****9914" },
  { id: "ACC-005", name: "Petty Cash", institution: "On-premise", type: "cash", balance: 2400, lastSync: "Manual", status: "manual", number: null },
]

export const employees = [
  { id: "EMP-001", name: "Jordan Avery", email: "jordan@meridiantech.io", department: "Finance", title: "CFO", salary: 240000, status: "active", startDate: "2020-03-15", payType: "salary" },
  { id: "EMP-002", name: "Marcus Chen", email: "marcus@meridiantech.io", department: "Sales", title: "VP of Sales", salary: 180000, status: "active", startDate: "2021-01-10", payType: "salary" },
  { id: "EMP-003", name: "Priya Sharma", email: "priya@meridiantech.io", department: "Engineering", title: "Staff Engineer", salary: 220000, status: "active", startDate: "2019-08-22", payType: "salary" },
  { id: "EMP-004", name: "Alex Rivera", email: "alex@meridiantech.io", department: "Engineering", title: "Senior Engineer", salary: 185000, status: "active", startDate: "2022-04-05", payType: "salary" },
  { id: "EMP-005", name: "Sam Okafor", email: "sam@meridiantech.io", department: "Marketing", title: "Head of Marketing", salary: 165000, status: "active", startDate: "2021-07-19", payType: "salary" },
  { id: "EMP-006", name: "Taylor Kim", email: "taylor@meridiantech.io", department: "Design", title: "Lead Designer", salary: 155000, status: "active", startDate: "2023-02-14", payType: "salary" },
  { id: "EMP-007", name: "Chris Thompson", email: "chris@meridiantech.io", department: "Engineering", title: "Backend Engineer", salary: 170000, status: "active", startDate: "2022-09-01", payType: "salary" },
  { id: "EMP-008", name: "Dana Walsh", email: "dana@meridiantech.io", department: "Operations", title: "Operations Manager", salary: 140000, status: "active", startDate: "2020-11-30", payType: "salary" },
]

export const products = [
  { id: "PRD-001", name: "Meridian Platform – Enterprise", type: "service", sku: "MP-ENT-001", price: 4999, unit: "month", taxable: false, status: "active", revenue: 419916 },
  { id: "PRD-002", name: "Meridian Platform – Professional", type: "service", sku: "MP-PRO-001", price: 999, unit: "month", taxable: false, status: "active", revenue: 107892 },
  { id: "PRD-003", name: "Meridian Platform – Starter", type: "service", sku: "MP-STR-001", price: 299, unit: "month", taxable: false, status: "active", revenue: 35880 },
  { id: "PRD-004", name: "Professional Services – Implementation", type: "service", sku: "PS-IMP-001", price: 250, unit: "hour", taxable: true, status: "active", revenue: 87500 },
  { id: "PRD-005", name: "Professional Services – Training", type: "service", sku: "PS-TRN-001", price: 150, unit: "hour", taxable: true, status: "active", revenue: 24000 },
  { id: "PRD-006", name: "API Add-on (100K calls/mo)", type: "service", sku: "API-100K", price: 199, unit: "month", taxable: false, status: "active", revenue: 14328 },
  { id: "PRD-007", name: "Data Migration Service", type: "service", sku: "DM-SVC-001", price: 2500, unit: "project", taxable: true, status: "active", revenue: 35000 },
  { id: "PRD-008", name: "Custom Integrations", type: "service", sku: "CI-001", price: 5000, unit: "project", taxable: true, status: "active", revenue: 40000 },
]

export const revenueData = [
  { month: "Jan", revenue: 284000, expenses: 198000, profit: 86000 },
  { month: "Feb", revenue: 312000, expenses: 204000, profit: 108000 },
  { month: "Mar", revenue: 298000, expenses: 211000, profit: 87000 },
  { month: "Apr", revenue: 341000, expenses: 219000, profit: 122000 },
  { month: "May", revenue: 368000, expenses: 228000, profit: 140000 },
  { month: "Jun", revenue: 355000, expenses: 235000, profit: 120000 },
  { month: "Jul", revenue: 392000, expenses: 242000, profit: 150000 },
  { month: "Aug", revenue: 418000, expenses: 251000, profit: 167000 },
  { month: "Sep", revenue: 401000, expenses: 248000, profit: 153000 },
  { month: "Oct", revenue: 445000, expenses: 261000, profit: 184000 },
  { month: "Nov", revenue: 462000, expenses: 271000, profit: 191000 },
  { month: "Dec", revenue: 489000, expenses: 280000, profit: 209000 },
]

export const cashFlowData = [
  { week: "W1", inflow: 142000, outflow: 88000 },
  { week: "W2", inflow: 98000, outflow: 112000 },
  { week: "W3", inflow: 164000, outflow: 94000 },
  { week: "W4", inflow: 58000, outflow: 76000 },
  { week: "W5", inflow: 201000, outflow: 108000 },
  { week: "W6", inflow: 87000, outflow: 131000 },
  { week: "W7", inflow: 174000, outflow: 95000 },
  { week: "W8", inflow: 122000, outflow: 88000 },
]

export const expenseCategoryData = [
  { name: "Cloud Infrastructure", value: 342000, color: "#14968C" },
  { name: "Payroll & Benefits", value: 2210400, color: "#14A3B8" },
  { name: "Office & Facilities", value: 117600, color: "#059669" },
  { name: "Software & Tools", value: 186000, color: "#D97706" },
  { name: "Sales & Marketing", value: 284000, color: "#DC2626" },
  { name: "Travel & Entertainment", value: 94200, color: "#0E7490" },
  { name: "Professional Services", value: 120000, color: "#0F766E" },
]

export const aiInsights = [
  { id: 1, type: "warning", title: "Cash runway alert", description: "14 months runway. Collect $209K overdue to extend to 16 months.", action: "View collections", priority: "high" },
  { id: 2, type: "opportunity", title: "Upsell opportunity", description: "Enterprise revenue +18% MoM. 4 Professional accounts ready to upgrade.", action: "View customers", priority: "medium" },
  { id: 3, type: "info", title: "AWS spend spike", description: "Cloud costs +34% vs last month — check data transfer usage.", action: "Investigate", priority: "medium" },
  { id: 4, type: "success", title: "DSO improving", description: "DSO down from 47 to 38 days this quarter.", action: "View report", priority: "low" },
]

export const payrollRuns = [
  { id: "PAY-2024-11", period: "November 2024", date: "2024-11-27", grossPay: 184200, taxes: 55260, netPay: 128940, status: "completed", employees: 8 },
  { id: "PAY-2024-10", period: "October 2024", date: "2024-10-25", grossPay: 182400, taxes: 54720, netPay: 127680, status: "completed", employees: 8 },
  { id: "PAY-2024-09", period: "September 2024", date: "2024-09-27", grossPay: 178600, taxes: 53580, netPay: 125020, status: "completed", employees: 8 },
  { id: "PAY-2024-08", period: "August 2024", date: "2024-08-23", grossPay: 178600, taxes: 53580, netPay: 125020, status: "completed", employees: 8 },
  { id: "PAY-2024-07", period: "July 2024", date: "2024-07-26", grossPay: 172000, taxes: 51600, netPay: 120400, status: "completed", employees: 7 },
  { id: "PAY-2024-12", period: "December 2024", date: "2024-12-27", grossPay: 192400, taxes: 57720, netPay: 134680, status: "scheduled", employees: 8 },
]

export const taxSummary = {
  quarterlyEstimated: { due: "2025-01-15", amount: 124800, status: "upcoming" },
  salesTax: { q3: 28400, q4YTD: 19200, nextFiling: "2025-01-31" },
  payrollTax: { ytd: 652080, irs941Due: "2024-12-16", amount: 55260 },
  annualReturn: { year: 2023, filed: true, refund: 18400 },
}

export const estimates = [
  { id: "EST-2024-0218", customer: "Apex Dynamics Corp", customerId: "C001", amount: 42000, tax: 3360, total: 45360, status: "sent", issueDate: "2024-11-28", expiryDate: "2024-12-28", items: 4 },
  { id: "EST-2024-0217", customer: "Luminary Solutions", customerId: "C002", amount: 18500, tax: 1480, total: 19980, status: "accepted", issueDate: "2024-11-20", expiryDate: "2024-12-20", items: 2 },
  { id: "EST-2024-0216", customer: "Quantum Ventures", customerId: "C004", amount: 67500, tax: 5400, total: 72900, status: "viewed", issueDate: "2024-11-15", expiryDate: "2024-12-15", items: 6 },
  { id: "EST-2024-0215", customer: "Cascade Industries", customerId: "C005", amount: 9200, tax: 736, total: 9936, status: "draft", issueDate: "2024-11-12", expiryDate: "2024-12-12", items: 1 },
  { id: "EST-2024-0214", customer: "Orion Digital Ltd", customerId: "C006", amount: 31000, tax: 6200, total: 37200, status: "converted", issueDate: "2024-10-28", expiryDate: "2024-11-28", items: 3 },
  { id: "EST-2024-0213", customer: "Vantage Point Media", customerId: "C010", amount: 14800, tax: 1184, total: 15984, status: "declined", issueDate: "2024-10-22", expiryDate: "2024-11-22", items: 2 },
  { id: "EST-2024-0212", customer: "Ironclad Logistics", customerId: "C011", amount: 25600, tax: 2048, total: 27648, status: "sent", issueDate: "2024-11-05", expiryDate: "2024-12-05", items: 3 },
  { id: "EST-2024-0211", customer: "Blue Ridge Software", customerId: "C012", amount: 7800, tax: 624, total: 8424, status: "accepted", issueDate: "2024-11-01", expiryDate: "2024-12-01", items: 1 },
  { id: "EST-2024-0210", customer: "Solaris Group", customerId: "C008", amount: 11200, tax: 2128, total: 13328, status: "expired", issueDate: "2024-09-15", expiryDate: "2024-10-15", items: 2 },
  { id: "EST-2024-0209", customer: "Nexus Enterprises", customerId: "C003", amount: 54000, tax: 0, total: 54000, status: "converted", issueDate: "2024-10-10", expiryDate: "2024-11-10", items: 5 },
]

export const salesOrders = [
  { id: "SO-2024-0312", customer: "Luminary Solutions", customerId: "C002", estimateId: "EST-2024-0217", amount: 18500, tax: 1480, total: 19980, status: "confirmed", orderDate: "2024-11-22", expectedDate: "2024-12-06", items: 2, fulfilled: 0 },
  { id: "SO-2024-0311", customer: "Orion Digital Ltd", customerId: "C006", estimateId: "EST-2024-0214", amount: 31000, tax: 6200, total: 37200, status: "partially-fulfilled", orderDate: "2024-11-05", expectedDate: "2024-11-25", items: 3, fulfilled: 1 },
  { id: "SO-2024-0310", customer: "Nexus Enterprises", customerId: "C003", estimateId: "EST-2024-0209", amount: 54000, tax: 0, total: 54000, status: "invoiced", orderDate: "2024-10-18", expectedDate: "2024-11-01", items: 5, fulfilled: 5 },
  { id: "SO-2024-0309", customer: "Blue Ridge Software", customerId: "C012", estimateId: "EST-2024-0211", amount: 7800, tax: 624, total: 8424, status: "draft", orderDate: "2024-11-28", expectedDate: "2024-12-12", items: 1, fulfilled: 0 },
  { id: "SO-2024-0308", customer: "Apex Dynamics Corp", customerId: "C001", estimateId: null, amount: 28600, tax: 2288, total: 30888, status: "fulfilled", orderDate: "2024-11-10", expectedDate: "2024-11-28", items: 4, fulfilled: 4 },
  { id: "SO-2024-0307", customer: "Ironclad Logistics", customerId: "C011", estimateId: null, amount: 14200, tax: 1136, total: 15336, status: "confirmed", orderDate: "2024-11-26", expectedDate: "2024-12-10", items: 2, fulfilled: 0 },
  { id: "SO-2024-0306", customer: "Cascade Industries", customerId: "C005", estimateId: null, amount: 9600, tax: 768, total: 10368, status: "partially-fulfilled", orderDate: "2024-11-14", expectedDate: "2024-11-30", items: 3, fulfilled: 2 },
  { id: "SO-2024-0305", customer: "Vantage Point Media", customerId: "C010", estimateId: null, amount: 22100, tax: 1768, total: 23868, status: "cancelled", orderDate: "2024-10-20", expectedDate: "2024-11-05", items: 3, fulfilled: 0 },
  { id: "SO-2024-0304", customer: "Quantum Ventures", customerId: "C004", estimateId: null, amount: 41500, tax: 3320, total: 44820, status: "invoiced", orderDate: "2024-10-08", expectedDate: "2024-10-28", items: 5, fulfilled: 5 },
  { id: "SO-2024-0303", customer: "Solaris Group", customerId: "C008", estimateId: null, amount: 6800, tax: 1292, total: 8092, status: "fulfilled", orderDate: "2024-11-18", expectedDate: "2024-12-02", items: 1, fulfilled: 1 },
]

export const purchaseOrders = [
  { id: "PO-2024-0189", vendor: "AWS (Amazon Web Services)", vendorId: "V001", amount: 32000, status: "ordered", orderDate: "2024-11-25", expectedDate: "2024-12-05", items: 3, received: 0 },
  { id: "PO-2024-0188", vendor: "Datadog Inc.", vendorId: "V006", amount: 8400, status: "partially-received", orderDate: "2024-11-18", expectedDate: "2024-11-30", items: 2, received: 1 },
  { id: "PO-2024-0187", vendor: "Morgan Office Supplies", vendorId: "V008", amount: 1240, status: "received", orderDate: "2024-11-10", expectedDate: "2024-11-20", items: 8, received: 8 },
  { id: "PO-2024-0186", vendor: "GitLab Inc.", vendorId: "V007", amount: 4200, status: "approved", orderDate: "2024-11-28", expectedDate: "2024-12-15", items: 1, received: 0 },
  { id: "PO-2024-0185", vendor: "Adobe Inc.", vendorId: "V005", amount: 3600, status: "draft", orderDate: "2024-11-29", expectedDate: "2024-12-20", items: 2, received: 0 },
  { id: "PO-2024-0184", vendor: "Salesforce Inc.", vendorId: "V002", amount: 15600, status: "received", orderDate: "2024-10-15", expectedDate: "2024-11-01", items: 1, received: 1 },
  { id: "PO-2024-0183", vendor: "Stripe Inc.", vendorId: "V004", amount: 2800, status: "cancelled", orderDate: "2024-10-08", expectedDate: "2024-10-20", items: 1, received: 0 },
  { id: "PO-2024-0182", vendor: "WeWork (Office Lease)", vendorId: "V003", amount: 9800, status: "ordered", orderDate: "2024-11-20", expectedDate: "2024-12-01", items: 1, received: 0 },
]

export const payments = [
  { id: "PAY-IN-0847", type: "incoming", party: "Nexus Enterprises", ref: "INV-2024-0845", amount: 38200, method: "ACH", date: "2024-11-28", status: "completed", account: "Operating Checking" },
  { id: "PAY-OUT-0341", type: "outgoing", party: "Stripe Inc.", ref: "BILL-2024-0337", amount: 3200, method: "ACH", date: "2024-11-29", status: "completed", account: "Operating Checking" },
  { id: "PAY-OUT-0340", type: "outgoing", party: "WeWork (Office Lease)", ref: "BILL-2024-0339", amount: 9800, method: "Wire", date: "2024-11-28", status: "completed", account: "Operating Checking" },
  { id: "PAY-IN-0846", type: "incoming", party: "Cascade Industries", ref: "INV-2024-0843", amount: 9612, method: "Credit Card", date: "2024-11-20", status: "completed", account: "Operating Checking" },
  { id: "PAY-OUT-0339", type: "outgoing", party: "Payroll Run #24", ref: "PAY-2024-11", amount: 128940, method: "ACH", date: "2024-11-27", status: "completed", account: "Payroll Checking" },
  { id: "PAY-IN-0845", type: "incoming", party: "Solaris Group", ref: "INV-2024-0836", amount: 4998, method: "Wire", date: "2024-11-24", status: "completed", account: "Operating Checking" },
  { id: "PAY-OUT-0338", type: "outgoing", party: "AWS (Amazon Web Services)", ref: "BILL-2024-0341", amount: 28400, method: "ACH", date: "2024-12-02", status: "scheduled", account: "Operating Checking" },
  { id: "PAY-IN-0844", type: "incoming", party: "Ironclad Logistics", ref: "INV-2024-0839", amount: 9828, method: "ACH", date: "2024-11-19", status: "completed", account: "Operating Checking" },
  { id: "PAY-OUT-0337", type: "outgoing", party: "Datadog Inc.", ref: "BILL-2024-0338", amount: 6400, method: "ACH", date: "2024-12-08", status: "pending", account: "Operating Checking" },
  { id: "PAY-IN-0843", type: "incoming", party: "Apex Dynamics Corp", ref: "INV-2024-0837", amount: 33480, method: "ACH", date: "2024-10-29", status: "completed", account: "Operating Checking" },
  { id: "PAY-OUT-0336", type: "outgoing", party: "Salesforce Inc.", ref: "BILL-2024-0340", amount: 14200, method: "ACH", date: "2024-12-01", status: "failed", account: "Operating Checking" },
  { id: "PAY-IN-0842", type: "incoming", party: "Luminary Solutions", ref: "INV-2024-0846", amount: 13500, method: "Credit Card", date: "2024-12-10", status: "scheduled", account: "Operating Checking" },
]

export const inventoryItems = [
  { id: "INV-SKU-001", name: "Meridian Hardware Kit – Pro", sku: "HW-PRO-01", category: "Hardware", qty: 48, reorderPoint: 20, unitCost: 185, value: 8880, location: "SF Warehouse", status: "in-stock" },
  { id: "INV-SKU-002", name: "Meridian Hardware Kit – Starter", sku: "HW-STR-01", category: "Hardware", qty: 12, reorderPoint: 25, unitCost: 95, value: 1140, location: "SF Warehouse", status: "low-stock" },
  { id: "INV-SKU-003", name: "USB-C Docking Station", sku: "ACC-DOC-02", category: "Accessories", qty: 0, reorderPoint: 15, unitCost: 120, value: 0, location: "SF Warehouse", status: "out-of-stock" },
  { id: "INV-SKU-004", name: "Branded Notebook Pack (50)", sku: "SWAG-NB-50", category: "Swag", qty: 86, reorderPoint: 30, unitCost: 8, value: 688, location: "Marketing Closet", status: "in-stock" },
  { id: "INV-SKU-005", name: "Conference Banner Stand", sku: "EVT-BNR-01", category: "Events", qty: 4, reorderPoint: 2, unitCost: 240, value: 960, location: "Events Storage", status: "in-stock" },
  { id: "INV-SKU-006", name: "Laptop Sleeve – 14\"", sku: "ACC-SLV-14", category: "Accessories", qty: 18, reorderPoint: 20, unitCost: 28, value: 504, location: "SF Warehouse", status: "low-stock" },
  { id: "INV-SKU-007", name: "Onboarding Welcome Kit", sku: "HR-KIT-01", category: "HR", qty: 32, reorderPoint: 10, unitCost: 45, value: 1440, location: "HR Closet", status: "in-stock" },
  { id: "INV-SKU-008", name: "Server Rack Mount Kit", sku: "HW-RCK-01", category: "Hardware", qty: 6, reorderPoint: 5, unitCost: 320, value: 1920, location: "Data Center", status: "in-stock" },
]

export const projects = [
  { id: "PRJ-001", name: "Apex Dynamics – Enterprise Rollout", client: "Apex Dynamics Corp", status: "in-progress", budget: 125000, spent: 78400, billable: 92000, progress: 62, startDate: "2024-09-01", endDate: "2025-01-31", manager: "Marcus Chen" },
  { id: "PRJ-002", name: "Luminary – Platform Migration", client: "Luminary Solutions", status: "in-progress", budget: 48000, spent: 31200, billable: 36500, progress: 71, startDate: "2024-10-15", endDate: "2024-12-20", manager: "Priya Sharma" },
  { id: "PRJ-003", name: "Orion Digital – Custom Integration", client: "Orion Digital Ltd", status: "on-hold", budget: 35000, spent: 8400, billable: 9200, progress: 24, startDate: "2024-11-01", endDate: "2025-02-28", manager: "Alex Rivera" },
  { id: "PRJ-004", name: "Internal – Q4 Finance System Upgrade", client: "Internal", status: "in-progress", budget: 22000, spent: 14800, billable: 0, progress: 68, startDate: "2024-10-01", endDate: "2024-12-15", manager: "Jordan Avery" },
  { id: "PRJ-005", name: "Cascade – Training & Enablement", client: "Cascade Industries", status: "completed", budget: 18000, spent: 16200, billable: 18000, progress: 100, startDate: "2024-08-01", endDate: "2024-10-30", manager: "Sam Okafor" },
  { id: "PRJ-006", name: "Titanium – Multi-entity Setup", client: "Titanium Capital Partners", status: "open", budget: 95000, spent: 0, billable: 0, progress: 0, startDate: "2024-12-10", endDate: "2025-04-30", manager: "Jordan Avery" },
  { id: "PRJ-007", name: "Vantage – Analytics Dashboard", client: "Vantage Point Media", status: "in-progress", budget: 28000, spent: 11200, billable: 14500, progress: 45, startDate: "2024-11-05", endDate: "2025-01-15", manager: "Taylor Kim" },
]

export const timeEntries = [
  { id: "TE-1142", employee: "Priya Sharma", project: "Luminary – Platform Migration", task: "API migration", hours: 6.5, date: "2024-11-28", status: "approved", billable: true, rate: 220 },
  { id: "TE-1141", employee: "Marcus Chen", project: "Apex Dynamics – Enterprise Rollout", task: "Stakeholder workshop", hours: 4.0, date: "2024-11-28", status: "approved", billable: true, rate: 250 },
  { id: "TE-1140", employee: "Alex Rivera", project: "Orion Digital – Custom Integration", task: "Webhook debugging", hours: 3.5, date: "2024-11-27", status: "pending", billable: true, rate: 200 },
  { id: "TE-1139", employee: "Jordan Avery", project: "Internal – Q4 Finance System Upgrade", task: "Requirements review", hours: 2.0, date: "2024-11-27", status: "approved", billable: false, rate: 0 },
  { id: "TE-1138", employee: "Taylor Kim", project: "Vantage – Analytics Dashboard", task: "UI prototyping", hours: 7.0, date: "2024-11-26", status: "approved", billable: true, rate: 180 },
  { id: "TE-1137", employee: "Chris Thompson", project: "Apex Dynamics – Enterprise Rollout", task: "Backend services", hours: 8.0, date: "2024-11-26", status: "approved", billable: true, rate: 190 },
  { id: "TE-1136", employee: "Sam Okafor", project: "Cascade – Training & Enablement", task: "Training materials", hours: 5.0, date: "2024-11-25", status: "approved", billable: true, rate: 175 },
  { id: "TE-1135", employee: "Dana Walsh", project: "Internal – Q4 Finance System Upgrade", task: "Process documentation", hours: 3.0, date: "2024-11-25", status: "pending", billable: false, rate: 0 },
  { id: "TE-1134", employee: "Priya Sharma", project: "Luminary – Platform Migration", task: "Data validation", hours: 5.5, date: "2024-11-24", status: "approved", billable: true, rate: 220 },
  { id: "TE-1133", employee: "Alex Rivera", project: "Apex Dynamics – Enterprise Rollout", task: "SSO configuration", hours: 4.5, date: "2024-11-22", status: "rejected", billable: true, rate: 200 },
]

export const documents = [
  { id: "DOC-001", name: "Master Service Agreement – Apex Dynamics.pdf", type: "Contract", size: "2.4 MB", uploadedBy: "Jordan Avery", uploadedAt: "2024-11-28", tags: ["legal", "customer"], status: "active" },
  { id: "DOC-002", name: "Q3 2024 Financial Statements.xlsx", type: "Report", size: "1.1 MB", uploadedBy: "Jordan Avery", uploadedAt: "2024-10-15", tags: ["finance", "quarterly"], status: "active" },
  { id: "DOC-003", name: "AWS November Invoice.pdf", type: "Invoice", size: "340 KB", uploadedBy: "Dana Walsh", uploadedAt: "2024-11-30", tags: ["vendor", "bill"], status: "active" },
  { id: "DOC-004", name: "Employee Handbook 2024.pdf", type: "Policy", size: "4.8 MB", uploadedBy: "Sam Okafor", uploadedAt: "2024-01-10", tags: ["hr", "policy"], status: "active" },
  { id: "DOC-005", name: "Orion SOW – Custom Integration.docx", type: "SOW", size: "890 KB", uploadedBy: "Marcus Chen", uploadedAt: "2024-10-28", tags: ["project", "sow"], status: "active" },
  { id: "DOC-006", name: "Bank Statement – Nov 2024.pdf", type: "Statement", size: "620 KB", uploadedBy: "System", uploadedAt: "2024-12-01", tags: ["banking"], status: "active" },
  { id: "DOC-007", name: "Tax Filing Package 2023.zip", type: "Tax", size: "12.6 MB", uploadedBy: "Jordan Avery", uploadedAt: "2024-03-20", tags: ["tax", "archive"], status: "archived" },
  { id: "DOC-008", name: "Board Deck – Q4 Strategy.pptx", type: "Presentation", size: "8.2 MB", uploadedBy: "Jordan Avery", uploadedAt: "2024-11-15", tags: ["board", "strategy"], status: "active" },
  { id: "DOC-009", name: "Insurance Certificate 2024.pdf", type: "Compliance", size: "210 KB", uploadedBy: "Dana Walsh", uploadedAt: "2024-02-01", tags: ["compliance"], status: "active" },
  { id: "DOC-010", name: "Vendor W-9 – Datadog.pdf", type: "Tax", size: "180 KB", uploadedBy: "System", uploadedAt: "2024-06-12", tags: ["vendor", "tax"], status: "active" },
]

export const automations = [
  { id: "AUTO-001", name: "Overdue invoice reminder", trigger: "Invoice overdue > 7 days", action: "Send email reminder + notify owner", status: "enabled", runs: 142, lastRun: "2024-11-30", category: "Collections" },
  { id: "AUTO-002", name: "Expense auto-approve under $100", trigger: "Expense submitted < $100", action: "Auto-approve & categorize", status: "enabled", runs: 318, lastRun: "2024-11-29", category: "Expenses" },
  { id: "AUTO-003", name: "Low cash balance alert", trigger: "Cash balance < $500K", action: "Slack alert to finance channel", status: "enabled", runs: 4, lastRun: "2024-10-12", category: "Cash" },
  { id: "AUTO-004", name: "New bill → approval workflow", trigger: "Bill created > $5,000", action: "Route to CFO for approval", status: "enabled", runs: 56, lastRun: "2024-11-28", category: "Payables" },
  { id: "AUTO-005", name: "Estimate → sales order on acceptance", trigger: "Estimate status = accepted", action: "Create draft sales order", status: "enabled", runs: 23, lastRun: "2024-11-20", category: "Revenue" },
  { id: "AUTO-009", name: "Sales order → invoice on fulfillment", trigger: "Sales order status = fulfilled", action: "Create draft invoice", status: "enabled", runs: 18, lastRun: "2024-11-28", category: "Revenue" },
  { id: "AUTO-006", name: "Weekly P&L digest", trigger: "Every Monday 8:00 AM", action: "Email P&L summary to leadership", status: "enabled", runs: 48, lastRun: "2024-11-25", category: "Reporting" },
  { id: "AUTO-007", name: "PO received → create bill", trigger: "PO fully received", action: "Generate vendor bill draft", status: "disabled", runs: 12, lastRun: "2024-09-18", category: "Payables" },
  { id: "AUTO-008", name: "Inventory reorder alert", trigger: "Qty ≤ reorder point", action: "Create draft purchase order", status: "enabled", runs: 9, lastRun: "2024-11-26", category: "Inventory" },
]

export const analyticsMetrics = [
  { label: "MRR", value: 412000, previous: 389000, format: "currency" },
  { label: "ARR", value: 4944000, previous: 4668000, format: "currency" },
  { label: "Gross Margin", value: 68.4, previous: 65.2, format: "percent" },
  { label: "Customer Churn", value: 2.1, previous: 2.8, format: "percent" },
  { label: "NRR", value: 118, previous: 112, format: "percent" },
  { label: "CAC Payback", value: 11, previous: 14, format: "months" },
]

export const cohortData = [
  { cohort: "Jan '24", m0: 100, m1: 94, m2: 91, m3: 88, m4: 86, m5: 84 },
  { cohort: "Feb '24", m0: 100, m1: 95, m2: 92, m3: 90, m4: 87, m5: 85 },
  { cohort: "Mar '24", m0: 100, m1: 96, m2: 93, m3: 91, m4: 89, m5: null },
  { cohort: "Apr '24", m0: 100, m1: 97, m2: 94, m3: 92, m4: null, m5: null },
  { cohort: "May '24", m0: 100, m1: 96, m2: 95, m3: null, m4: null, m5: null },
  { cohort: "Jun '24", m0: 100, m1: 98, m2: null, m3: null, m4: null, m5: null },
]

export const kpis = {
  revenue: { current: 4965000, previous: 4182000, ytd: true, label: "Annual Revenue" },
  expenses: { current: 3249000, previous: 2891000, ytd: true, label: "Total Expenses" },
  profit: { current: 1716000, previous: 1291000, ytd: true, label: "Net Profit" },
  cashBalance: { current: 2328940, previous: 2100000, ytd: false, label: "Cash & Equivalents" },
  arBalance: { current: 285012, previous: 312000, ytd: false, label: "Accounts Receivable" },
  apBalance: { current: 64940, previous: 71200, ytd: false, label: "Accounts Payable" },
  dso: { current: 38, previous: 47, ytd: false, label: "Days Sales Outstanding" },
  burnRate: { current: 271000, previous: 261000, ytd: false, label: "Monthly Burn Rate" },
}

export type Page =
  | "landing"
  | "dashboard"
  | "estimates"
  | "sales-orders"
  | "invoices"
  | "customers"
  | "products"
  | "inventory"
  | "bills"
  | "expenses"
  | "purchase-orders"
  | "vendors"
  | "banking"
  | "payments"
  | "payroll"
  | "employees"
  | "taxes"
  | "projects"
  | "time-tracking"
  | "reports"
  | "ai-assistant"
  | "analytics"
  | "automation"
  | "documents"
  | "settings"
