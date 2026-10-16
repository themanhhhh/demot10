import type { BusinessScenario, ResourceType } from "./model";

export const resourceLabels: Record<ResourceType, string> = {
  IN_HOUSE: "In-house",
  AGENCY: "Agency",
  FREELANCER: "Freelancer",
  EXPERT: "Chuyên gia",
};

export const demoScenarios = [
  {
    id: "ads",
    painLabel: "Đốt thêm tiền Ads nhưng số vẫn đi ngang.",
    problem: "Doanh số tăng chậm dù đã chạy quảng cáo",
    response: "Có thể xem xét hành trình chuyển đổi, đề xuất giá trị hoặc cách phối hợp nguồn lực. Partner chuyên môn đề xuất hướng; bạn quyết định bước tiếp.",
    solutions: [
      {
        id: "ads-conversion",
        title: "Làm rõ hành trình chuyển đổi",
        description: "Xem xét các điểm khách hàng đi qua trước khi mua.",
        configurations: [
          {
            id: "ads-conversion-specialist",
            title: "Team hiện tại + chuyên gia",
            resources: ["IN_HOUSE", "EXPERT"],
            roleDescriptions: ["Team hiện tại chia sẻ bối cảnh và vận hành.", "Chuyên môn bổ sung được xác định sau khi Client làm rõ phạm vi."],
          },
          {
            id: "ads-conversion-agency",
            title: "Team hiện tại + Agency",
            resources: ["IN_HOUSE", "AGENCY"],
            roleDescriptions: ["Team hiện tại giữ kiến thức nội bộ.", "Agency chỉ tham gia các đầu việc được thống nhất."],
          },
        ],
      },
      {
        id: "ads-value",
        title: "Làm rõ đề xuất giá trị và kênh",
        description: "Rà soát thông điệp bán hàng, lợi thế sản phẩm và kênh tiếp cận khách hàng.",
        configurations: [
          {
            id: "ads-value-freelancer",
            title: "Team hiện tại + Freelancer",
            resources: ["IN_HOUSE", "FREELANCER"],
            roleDescriptions: ["Team hiện tại cung cấp bối cảnh sản phẩm.", "Freelancer có thể bổ sung một chuyên môn cụ thể trong phạm vi rõ."],
          },
          {
            id: "ads-value-agency-expert",
            title: "Team hiện tại + Agency + chuyên gia",
            resources: ["IN_HOUSE", "AGENCY", "EXPERT"],
            roleDescriptions: ["Nguồn lực hiện có được giữ lại.", "Các vai trò bên ngoài cần được phân định trước khi hình thành Deal."],
          },
        ],
      },
    ],
  },
  {
    id: "team",
    painLabel: "Nuôi cả team nhưng sếp vẫn phải tự gánh số.",
    problem: "Team hiện tại đang quá tải",
    response: "Có thể xem xét phần team đang phải tự gánh và năng lực cần bổ sung. Giữ lại điều đang vận hành tốt; Client quyết định phạm vi phối hợp.",
    solutions: [
      {
        id: "team-capacity",
        title: "Bổ sung năng lực còn thiếu",
        description: "Xem phần nào có thể phối hợp với đội ngũ hiện tại.",
        configurations: [
          {
            id: "team-capacity-freelancer",
            title: "Team hiện tại + Freelancer",
            resources: ["IN_HOUSE", "FREELANCER"],
            roleDescriptions: ["Team hiện tại tiếp tục nắm vận hành.", "Freelancer có thể đảm nhận một chuyên môn theo phạm vi thống nhất."],
          },
          {
            id: "team-capacity-agency",
            title: "Team hiện tại + Agency",
            resources: ["IN_HOUSE", "AGENCY"],
            roleDescriptions: ["Nguồn lực in-house được giữ lại.", "Agency có thể phối hợp ở các đầu việc đã phân định."],
          },
        ],
      },
      {
        id: "team-coordination",
        title: "Làm rõ cách phối hợp công việc",
        description: "Xem xét vai trò, phạm vi và điểm bàn giao giữa các nguồn lực.",
        configurations: [
          {
            id: "team-coordination-expert",
            title: "Team hiện tại + chuyên gia",
            resources: ["IN_HOUSE", "EXPERT"],
            roleDescriptions: ["Client và team nội bộ làm rõ nhu cầu.", "Chuyên gia có thể đề xuất cách phối hợp sau khi xác định phạm vi."],
          },
          {
            id: "team-coordination-mixed",
            title: "Team hiện tại + Freelancer + Agency",
            resources: ["IN_HOUSE", "FREELANCER", "AGENCY"],
            roleDescriptions: ["Mỗi nguồn lực cần có vai trò và đầu việc rõ.", "Client quyết định cấu hình sau khi xem xét điều kiện."],
          },
        ],
      },
    ],
  },
  {
    id: "product",
    painLabel: "Tung sản phẩm mới nhưng thị trường chưa phản hồi.",
    problem: "Sản phẩm mới chưa có phản hồi rõ",
    response: "Có thể bắt đầu bằng việc làm rõ điều cần kiểm chứng và cách lắng nghe phản hồi. Đây là câu hỏi mở, không phải chẩn đoán sản phẩm.",
    solutions: [
      {
        id: "product-validation",
        title: "Làm rõ giả thuyết cần kiểm chứng",
        description: "Xác định câu hỏi cần tìm hiểu trước khi cân nhắc bước tiếp theo.",
        configurations: [
          {
            id: "product-validation-specialist",
            title: "Team hiện tại + chuyên gia",
            resources: ["IN_HOUSE", "EXPERT"],
            roleDescriptions: ["Team hiện tại chia sẻ mục tiêu và bối cảnh.", "Chuyên môn bổ sung được đề xuất khi câu hỏi đã rõ."],
          },
          {
            id: "product-validation-freelancer",
            title: "Team hiện tại + Freelancer",
            resources: ["IN_HOUSE", "FREELANCER"],
            roleDescriptions: ["Team hiện tại giữ kiến thức sản phẩm.", "Freelancer có thể hỗ trợ một đầu việc cụ thể đã thống nhất."],
          },
        ],
      },
      {
        id: "product-channel",
        title: "Xem xét cách tiếp cận khách hàng",
        description: "Xác định kênh tiếp cận và điểm tiếp xúc cần thử nghiệm với khách hàng.",
        configurations: [
          {
            id: "product-channel-agency",
            title: "Team hiện tại + Agency",
            resources: ["IN_HOUSE", "AGENCY"],
            roleDescriptions: ["Team hiện tại cung cấp bối cảnh sản phẩm.", "Agency chỉ triển khai khi phạm vi và vai trò đã rõ."],
          },
          {
            id: "product-channel-mixed",
            title: "Team hiện tại + Freelancer + chuyên gia",
            resources: ["IN_HOUSE", "FREELANCER", "EXPERT"],
            roleDescriptions: ["Năng lực hiện có có thể được kết hợp với nguồn lực ngoài.", "Client quyết định cuối cùng về phạm vi và cam kết."],
          },
        ],
      },
    ],
  },
] satisfies BusinessScenario[];
