// Mock Data for DOMICOP Admin System

export interface Member {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  joinDate: string
  contributions: number
  activeLoans: number
  avatar?: string
  initials: string
}

export interface Loan {
  id: string
  borrowerId: string
  borrowerName: string
  amount: number
  type: "personal" | "business"
  status: "pending" | "approved" | "rejected" | "disbursed"
  creditScore: number
  riskProfile: "low" | "medium" | "high"
  requestDate: string
  purpose?: string
}

export interface Contribution {
  id: string
  memberId: string
  memberName: string
  amount: number
  date: string
  type: "monthly" | "voluntary" | "dividend"
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  type: "member" | "prospect" | "support"
  priority?: "normal" | "urgent"
  unread: boolean
}

export interface SystemSettings {
  general: {
    cooperativeName: string
    timezone: string
    logoUrl?: string
  }
  memberRules: {
    automaticApproval: boolean
    registrationFee: number
    suspensionGracePeriod: number
    defaultAccountProtocol: string
  }
  financialProtocols: {
    baseInterestRate: number
    dividendSchedule: "monthly" | "quarterly" | "annually"
    contributionThresholds: {
      entry: number
      standard: number
      premium: number
    }
  }
  security: {
    twoFactorEnforced: boolean
    sessionTimeout: number
  }
}

// Mock Members Data
export const mockMembers: Member[] = [
  {
    id: "9045",
    name: "Elena Kostic",
    email: "elena.k@example.com",
    status: "active",
    joinDate: "2023-10-12",
    contributions: 12500,
    activeLoans: 0,
    initials: "EK",
  },
  {
    id: "9044",
    name: "Julian Mars",
    email: "j.mars@example.com",
    status: "pending",
    joinDate: "2023-10-11",
    contributions: 0,
    activeLoans: 0,
    initials: "JM",
  },
  {
    id: "9041",
    name: "Sarah Webb",
    email: "webb.s@example.com",
    status: "active",
    joinDate: "2023-10-09",
    contributions: 8700,
    activeLoans: 1,
    initials: "SW",
  },
  {
    id: "9040",
    name: "Marcus Thorne",
    email: "m.thorne@example.com",
    status: "active",
    joinDate: "2023-10-08",
    contributions: 15200,
    activeLoans: 1,
    initials: "MT",
  },
  {
    id: "9038",
    name: "Linda Grey",
    email: "l.grey@example.com",
    status: "active",
    joinDate: "2023-10-05",
    contributions: 6300,
    activeLoans: 0,
    initials: "LG",
  },
  {
    id: "9035",
    name: "James Chen",
    email: "j.chen@example.com",
    status: "inactive",
    joinDate: "2023-09-28",
    contributions: 2100,
    activeLoans: 0,
    initials: "JC",
  },
  {
    id: "9032",
    name: "Maria Rodriguez",
    email: "m.rodriguez@example.com",
    status: "active",
    joinDate: "2023-09-25",
    contributions: 9800,
    activeLoans: 1,
    initials: "MR",
  },
  {
    id: "9030",
    name: "David Kim",
    email: "d.kim@example.com",
    status: "active",
    joinDate: "2023-09-22",
    contributions: 11400,
    activeLoans: 0,
    initials: "DK",
  },
  {
    id: "9028",
    name: "Emily Johnson",
    email: "e.johnson@example.com",
    status: "pending",
    joinDate: "2023-09-20",
    contributions: 0,
    activeLoans: 0,
    initials: "EJ",
  },
  {
    id: "9025",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    status: "active",
    joinDate: "2023-09-15",
    contributions: 18600,
    activeLoans: 2,
    initials: "RW",
  },
]

// Mock Loans Data
export const mockLoans: Loan[] = [
  {
    id: "4401",
    borrowerId: "9040",
    borrowerName: "Marcus Thorne",
    amount: 5000,
    type: "personal",
    status: "pending",
    creditScore: 745,
    riskProfile: "low",
    requestDate: "2023-10-15",
    purpose: "Home renovation",
  },
  {
    id: "4398",
    borrowerId: "9038",
    borrowerName: "Linda Grey",
    amount: 12400,
    type: "business",
    status: "pending",
    creditScore: 680,
    riskProfile: "medium",
    requestDate: "2023-10-14",
    purpose: "Business expansion",
  },
  {
    id: "4395",
    borrowerId: "9041",
    borrowerName: "Sarah Webb",
    amount: 8000,
    type: "personal",
    status: "approved",
    creditScore: 720,
    riskProfile: "low",
    requestDate: "2023-10-10",
    purpose: "Education expenses",
  },
  {
    id: "4390",
    borrowerId: "9025",
    borrowerName: "Robert Wilson",
    amount: 15000,
    type: "business",
    status: "disbursed",
    creditScore: 780,
    riskProfile: "low",
    requestDate: "2023-10-05",
    purpose: "Equipment purchase",
  },
  {
    id: "4385",
    borrowerId: "9032",
    borrowerName: "Maria Rodriguez",
    amount: 6500,
    type: "personal",
    status: "approved",
    creditScore: 695,
    riskProfile: "medium",
    requestDate: "2023-10-01",
    purpose: "Medical expenses",
  },
]

// Mock Contributions Data
export const mockContributionsTrend = [
  { month: "Jan", amount: 180000 },
  { month: "Feb", amount: 195000 },
  { month: "Mar", amount: 210000 },
  { month: "Apr", amount: 245000 },
  { month: "May", amount: 280000 },
  { month: "Jun", amount: 320000 },
]

export const mockRecentContributions: Contribution[] = [
  {
    id: "8829",
    memberId: "9045",
    memberName: "Elena Kostic",
    amount: 500,
    date: "2023-10-15T14:30:00Z",
    type: "monthly",
  },
  {
    id: "8828",
    memberId: "9041",
    memberName: "Sarah Webb",
    amount: 750,
    date: "2023-10-15T10:15:00Z",
    type: "monthly",
  },
  {
    id: "8825",
    memberId: "9030",
    memberName: "David Kim",
    amount: 1000,
    date: "2023-10-14T16:45:00Z",
    type: "voluntary",
  },
  {
    id: "8820",
    memberId: "9025",
    memberName: "Robert Wilson",
    amount: 500,
    date: "2023-10-14T09:00:00Z",
    type: "monthly",
  },
]

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: "msg-001",
    senderId: "9045",
    senderName: "Elena Kostic",
    content: "Hi, I have a question about my recent contribution.",
    timestamp: "2023-10-15T10:30:00Z",
    type: "member",
    unread: true,
  },
  {
    id: "msg-002",
    senderId: "prospect-001",
    senderName: "Michael Brown",
    content:
      "I am interested in joining the cooperative. What are the requirements?",
    timestamp: "2023-10-15T09:15:00Z",
    type: "prospect",
    unread: true,
  },
  {
    id: "msg-003",
    senderId: "support-001",
    senderName: "System Support",
    content: "Your loan application requires additional documentation.",
    timestamp: "2023-10-14T16:20:00Z",
    type: "support",
    priority: "urgent",
    unread: false,
  },
]

// Mock System Settings
export const mockSystemSettings: SystemSettings = {
  general: {
    cooperativeName: "DOMICOP Cooperative Society",
    timezone: "UTC+1",
  },
  memberRules: {
    automaticApproval: false,
    registrationFee: 500,
    suspensionGracePeriod: 30,
    defaultAccountProtocol: "standard",
  },
  financialProtocols: {
    baseInterestRate: 4.5,
    dividendSchedule: "quarterly",
    contributionThresholds: {
      entry: 1000,
      standard: 5000,
      premium: 15000,
    },
  },
  security: {
    twoFactorEnforced: true,
    sessionTimeout: 30,
  },
}

// Dashboard Stats
export const dashboardStats = {
  totalMembers: 2450,
  totalContributions: 1200000,
  pendingLoans: 14,
  activeCorrespondence: 8,
  memberGrowth: 12,
  contributionGrowth: 5.4,
}

// Activity Feed
export const activityFeed = [
  {
    id: 1,
    type: "loan",
    message: "New loan application #4401",
    time: "2 minutes ago",
    priority: "high",
  },
  {
    id: 2,
    type: "contribution",
    message: "Contribution update #8829",
    time: "14 minutes ago",
    priority: "normal",
  },
  {
    id: 3,
    type: "system",
    message: "System backup complete",
    time: "1 hour ago",
    priority: "normal",
  },
  {
    id: 4,
    type: "member",
    message: "New member registered #9012",
    time: "3 hours ago",
    priority: "normal",
  },
  {
    id: 5,
    type: "loan",
    message: "Loan disbursement #4390",
    time: "5 hours ago",
    priority: "normal",
  },
]
