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
    painLabel: "Hebe Mall · ROAS tăng 343%",
    problem: "Hebe Mall chạy quảng cáo chuyển đổi nhưng kết quả ban đầu còn hạn chế.",
    response: "Trong chiến dịch 3 tháng, Hebe Mall kết hợp quảng cáo tăng tương tác cộng đồng với quảng cáo mua hàng, dùng tệp Custom/Lookalike và video đời sống. TikTok for Business công bố ROAS tăng 343%, CPA giảm 41% so với các chiến dịch trước.",
    caseResult: "ROAS +343% · CPA −41%",
    caseSourceUrl: "https://ads.tiktok.com/business/en-US/inspiration/hebe-mall",
    caseSourceName: "TikTok for Business · Hebe Mall",
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
    painLabel: "SB Group · tỷ lệ chuyển đổi tăng 90%",
    problem: "SB Group muốn cải thiện chuyển đổi cho thương hiệu Laura Sunshine trên website.",
    response: "SB Group dùng TikTok Pixel, Custom/Lookalike Audience và loại trừ người vừa mua sản phẩm giá trị cao; nội dung quảng cáo có nghệ sĩ và kể chuyện hài hước. TikTok for Business công bố tỷ lệ chuyển đổi tăng 90% so với chiến dịch trước, trong chiến dịch một tháng.",
    caseResult: "CVR +90% trong chiến dịch 1 tháng",
    caseSourceUrl: "https://ads.tiktok.com/business/en-US/inspiration/sb-group",
    caseSourceName: "TikTok for Business · SB Group",
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
    painLabel: "CRAZYTEEN Studio · bán hơn 7.900 sản phẩm",
    problem: "CRAZYTEEN Studio muốn tiếp cận khách hàng mới và tăng bán hàng trên TikTok Shop.",
    response: "CRAZYTEEN Studio kết hợp Video Shopping Ads, LIVE Shopping Ads, nội dung phối đồ và livestream trên TikTok Shop. TikTok for Business công bố chiến dịch 28 ngày bán hơn 7.900 sản phẩm; GMV quảng cáo cao gấp 6 lần các chiến dịch trước.",
    caseResult: ">7.900 sản phẩm · GMV quảng cáo ×6",
    caseSourceUrl: "https://ads.tiktok.com/business/en-US/inspiration/crazyteen-studio?redirected=1",
    caseSourceName: "TikTok for Business · CRAZYTEEN Studio",
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
