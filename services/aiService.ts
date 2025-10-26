
import { GoogleGenAI, Type } from "@google/genai";
import { ApiProvider, AnalyzedNiche, AiRequestOptions, Score } from '../types';

// This is a mock function for ChatGPT as we cannot implement the actual API call.
const callChatGptApiMock = async (prompt: string, options: AiRequestOptions, schema?: any): Promise<string> => {
  console.log(`Mocking ChatGPT API call with model ${options.model} and prompt:`, prompt);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
  const topicMatch = prompt.match(/chủ đề chính mà người dùng cung cấp là "([^"]+)"/);
  const topic = topicMatch ? topicMatch[1] : "chung";

  const generateRandomScore = (low: number, high: number): number => Math.floor(Math.random() * (high - low + 1)) + low;

  if (prompt.includes("brainstorm") && prompt.includes("ĐỘT PHÁ")) {
    const mockNiches: AnalyzedNiche[] = Array.from({ length: 10 }, (_, i) => {
      const compScore = generateRandomScore(2, 9);
      const nicheIdeas = [
          `Thử thách ${topic} trong 24 giờ`,
          `${topic} và Những câu chuyện chưa kể`,
          `Review Dụng Cụ ${topic} Siêu Rẻ vs Siêu Đắt`,
          `Xây dựng kênh ${topic} từ con số 0`,
          `${topic} dưới góc nhìn khoa học`,
          `So sánh ${topic} Việt Nam và Quốc Tế`,
          `Một ngày làm [nghề nghiệp liên quan đến ${topic}]`,
          `Phản ứng của người nước ngoài về ${topic} Việt Nam`,
          `Du lịch ${topic} siêu tiết kiệm`,
          `${topic} dành cho người hướng nội`
      ];
      const keywordsExamples = [
          [`thử thách ${topic} 24h`, `du lịch ${topic} 1 ngày`, `khám phá ${topic} trong 24 giờ`, `chi phí đi ${topic} 1 ngày`],
          [`lịch sử ${topic}`, `bí ẩn về ${topic}`, `sự thật thú vị về ${topic}`, `khám phá văn hóa ${topic}`],
          [`dụng cụ ${topic} giá rẻ`, `review đồ ${topic}`, `so sánh đồ ${topic} đắt và rẻ`, `có nên mua đồ ${topic} giá rẻ`],
          [`cách làm youtube về ${topic}`, `xây kênh youtube ${topic}`, `kiếm tiền từ youtube ${topic}`, `hướng dẫn làm video ${topic}`],
          [`khoa học giải thích ${topic}`, `tại sao ${topic} lại như vậy`, `nguyên lý hoạt động của ${topic}`, `sự thật khoa học về ${topic}`]
      ];

      return {
        title: nicheIdeas[i] || `Ý tưởng ${topic} độc đáo #${i + 1}`,
        description: `Kênh này tập trung khai thác khía cạnh độc đáo của chủ đề "${topic}", nhắm đến đối tượng khán giả tò mò và muốn khám phá những điều mới mẻ. Điểm khác biệt là góc nhìn chuyên sâu và cách thể hiện sáng tạo.`,
        monetization_potential: {
          score: generateRandomScore(5, 9),
          explanation: "Tiềm năng từ quảng cáo YouTube (RPM khá), affiliate marketing cho các sản phẩm liên quan và có thể bán khóa học/ebook."
        },
        audience_potential: {
          score: generateRandomScore(6, 10),
          explanation: "Chủ đề có tệp khán giả rộng, dễ dàng thu hút người xem nếu nội dung có chất lượng cao và độc đáo."
        },
        competition_level: {
          score: compScore,
          explanation: compScore > 7 ? "Thị trường bão hòa, cần nội dung cực kỳ đột phá." : (compScore > 4 ? "Cạnh tranh vừa phải, vẫn còn nhiều cơ hội." : "Ngách còn mới, ít cạnh tranh, tiềm năng lớn.")
        },
        content_direction: `Video 1: Thử thách [Hành động] trong 24h với chủ đề ${topic} | Video 2: 5 sự thật gây sốc về ${topic} mà bạn chưa bao giờ nghe.`,
        keywords: keywordsExamples[i % 5] || [
            `${topic} cho người mới`,
            `hướng dẫn ${topic} chi tiết`,
            `mẹo ${topic} hay`,
            `review ${topic} 2024`,
            `top 10 ${topic}`
        ]
      };
    });
    return JSON.stringify(mockNiches);
  }

  if (prompt.includes("viết một kịch bản video")) {
    return `
### **Kịch bản Video YouTube (Mẫu từ ChatGPT - Model: ${options.model})**

**Tiêu đề:** Thử Thách Nấu Ăn Cùng ChatGPT: Liệu AI có phải là đầu bếp tài ba?

---

**[MỞ ĐẦU - HOOK]**

**(0-15 giây)**

*Cảnh quay nhanh, vui nhộn: Nhân vật chính (bạn) nhìn vào tủ lạnh với vẻ mặt bối rối, sau đó quay sang camera.*

**Bạn:** Trong tủ lạnh chỉ còn vài quả trứng, một ít rau củ và... một hộp cá ngừ? Nấu gì bây giờ? Đừng lo, hôm nay chúng ta có một trợ thủ đặc biệt!

*Giơ điện thoại lên, màn hình hiển thị giao diện ChatGPT.*

**Bạn:** Xin giới thiệu, đầu bếp AI ChatGPT! Liệu nó có thể cứu vớt bữa tối của tôi không? Hãy cùng xem nhé!

---

**[THÂN BÀI]**

**(15 giây - 4 phút)**

**Phần 1: Thử thách bắt đầu**

*Bạn gõ vào điện thoại.*
**Bạn:** "Tôi có trứng, cà rốt, hành tây và cá ngừ. Hãy cho tôi một công thức ngon và dễ làm."

*Hiệu ứng âm thanh gõ phím. Màn hình hiển thị câu trả lời của AI.*
**Bạn (đọc to):** "Trứng cuộn cá ngừ kiểu Nhật... Nghe hay đấy! Thử luôn!"

**Phần 2: Quá trình thực hiện**

*Cảnh bạn làm theo công thức, có thể thêm một vài tình huống hài hước (ví dụ: cắt hành tây chảy nước mắt, lóng ngóng cuộn trứng).*
*Sử dụng text overlay để ghi các bước chính.*
*Bình luận dí dỏm về các chỉ dẫn của AI.*

---

**[KẾT LUẬN]**

**(4 phút - 5 phút)**

*Bạn bày món ăn ra đĩa, trông khá hấp dẫn.*
**Bạn:** Và đây là thành quả! Trông không tệ chút nào!

*Bạn nếm thử món ăn.*
**Bạn (vẻ mặt ngạc nhiên):** Wow! Ngon bất ngờ! ChatGPT, bạn đã được nhận!

*Quay sang camera.*
**Bạn:** Vậy là AI cũng có thể nấu ăn đấy chứ! Bạn nghĩ sao về thử thách này? Hãy để lại bình luận bên dưới nhé! Đừng quên nhấn like, đăng ký kênh và bật chuông thông báo để không bỏ lỡ những video tiếp theo! Cảm ơn và hẹn gặp lại!
`;
  }
  return "Đây là phản hồi mẫu từ ChatGPT.";
};

const callGeminiApi = async (prompt: string, apiKey: string, model: string, schema?: any): Promise<string> => {
  if (!apiKey) {
    throw new Error("API key for Gemini is not provided.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: schema ? {
      responseMimeType: "application/json",
      responseSchema: schema
    } : {}
  });

  return response.text;
};

const scoreSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: "Điểm số từ 1 đến 10." },
        explanation: { type: Type.STRING, description: "Giải thích ngắn gọn cho điểm số đó." }
    },
    required: ["score", "explanation"]
};

const nicheSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "Tiêu đề của ngách nội dung, ngắn gọn và hấp dẫn."
      },
      description: {
        type: Type.STRING,
        description: "Mô tả ngắn gọn về ngách và giải thích tiềm năng của nó."
      },
      monetization_potential: { ...scoreSchema, description: "Đánh giá tiềm năng kiếm tiền." },
      audience_potential: { ...scoreSchema, description: "Đánh giá tiềm năng thu hút khán giả." },
      competition_level: { ...scoreSchema, description: "Đánh giá mức độ cạnh tranh. Điểm CÀNG CAO nghĩa là CÀNG CẠNH TRANH (khó hơn)." },
      content_direction: {
        type: Type.STRING,
        description: "Gợi ý về các định dạng và hướng nội dung video cụ thể."
      },
      keywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Một danh sách các từ khóa SEO chính (khoảng 5-7 từ) liên quan trực tiếp đến ngách này."
      }
    },
    required: ["title", "description", "monetization_potential", "audience_potential", "competition_level", "content_direction", "keywords"]
  }
};


export const findNiches = async (topic: string, provider: ApiProvider, options: AiRequestOptions): Promise<AnalyzedNiche[]> => {
  const prompt = `Bạn là một chuyên gia chiến lược YouTube và một nhà sáng tạo nội dung bậc thầy với 10 năm kinh nghiệm. Nhiệm vụ của bạn là "brainstorm" và đề xuất những ý tưởng ngách ĐỘT PHÁ và THỰC TẾ cho chủ đề chính mà người dùng cung cấp là "${topic}".

Hãy suy nghĩ vượt ra ngoài những ý tưởng thông thường. Tìm kiếm những góc nhìn độc đáo, chưa được khai thác nhiều. Đề xuất 10 ngách nội dung cụ thể và có tiềm năng thành công cao.

Với MỖI ngách, hãy cung cấp thông tin chi tiết và chấm điểm theo cấu trúc JSON được yêu cầu:

1.  **title**: Một cái tên/tiêu đề CỤ THỂ và SÁNG TẠO cho kênh YouTube, không phải là một mô tả chung chung. Ví dụ, với chủ đề "Nấu ăn", thay vì "Ngách nấu ăn #1", hãy đề xuất "Bếp Nhỏ Của Gen Z" hoặc "Thử Thách Nấu Ăn Cùng Người Lạ". TUYỆT ĐỐI không sử dụng các mẫu như "Ngách [chủ đề] Sáng Tạo #Y".

2.  **description**: Mô tả chi tiết về ngách này. Nó tập trung vào điều gì? Đối tượng khán giả mục tiêu là ai (nhân khẩu học, sở thích)? Điểm độc đáo (unique selling point) giúp kênh nổi bật là gì?

3.  **monetization_potential**: Chấm điểm tiềm năng kiếm tiền từ 1-10 và giải thích lý do (RPM ước tính, cơ hội affiliate, tiềm năng bán sản phẩm/khóa học, thu hút tài trợ từ nhãn hàng nào...).

4.  **audience_potential**: Chấm điểm tiềm năng khán giả từ 1-10 và giải thích (độ lớn của thị trường, mức độ quan tâm của khán giả, khả năng tạo cộng đồng...).

5.  **competition_level**: Chấm điểm mức độ cạnh tranh từ 1-10. QUAN TRỌNG: 1 = Rất thấp (đại dương xanh, cơ hội vàng), 10 = Cực kỳ bão hòa (đại dương đỏ, cực khó). Giải thích ngắn gọn về các đối thủ chính nếu có.

6.  **content_direction**: Đề xuất 2-3 ý tưởng video CỤ THỂ và HẤP DẪN mà kênh có thể bắt đầu sản xuất ngay. Bao gồm cả TIÊU ĐỀ VIDEO gợi ý. Ví dụ: "Video 1: Thử thách sống sót 24h ở Sài Gòn chỉ với 100k - Tiêu đề: SINH TỒN 24H VỚI 100K TẠI SÀI GÒN - BẤT KHẢ THI?".

7.  **keywords**: Cung cấp một mảng chứa 5-7 từ khóa SEO dài (long-tail keywords) có liên quan trực tiếp, là những cụm từ mà khán giả mục tiêu SẼ THỰC SỰ tìm kiếm. Ví dụ: "kinh nghiệm du lịch sài gòn một mình", "quán ăn quận 1 giá sinh viên".`;

  try {
    let responseText: string;
    if (provider === ApiProvider.Gemini) {
      responseText = await callGeminiApi(prompt, options.apiKey, options.model, nicheSchema);
    } else {
      responseText = await callChatGptApiMock(prompt, options);
    }
    
    // The response is expected to be a JSON string of AnalyzedNiche[]
    const niches = JSON.parse(responseText);
    if (Array.isArray(niches) && niches.every(n => 
      'title' in n && 
      'monetization_potential' in n && 
      'audience_potential' in n && 
      'competition_level' in n &&
      'keywords' in n &&
      typeof n.monetization_potential.score === 'number'
    )) {
      return niches;
    }
    throw new Error("Invalid niche data format received from AI.");

  } catch (error) {
    console.error(`Error finding niches with ${provider}:`, error);
    // Fallback for parsing or other errors
    throw new Error("Không thể phân tích dữ liệu ngách từ AI. Vui lòng thử lại.");
  }
};

export const writeScript = async (niche: AnalyzedNiche, provider: ApiProvider, options: AiRequestOptions): Promise<string> => {
  const prompt = `Bạn là một nhà biên kịch YouTube chuyên nghiệp. Hãy viết một kịch bản video hoàn chỉnh và chi tiết cho một video YouTube có tiêu đề: "${niche.title}". 
  
  Chủ đề chính của video là: "${niche.description}".

  Kịch bản cần có cấu trúc 3 phần rõ ràng:
  1.  **Mở đầu (Hook):** Khoảng 15-20 giây đầu tiên, tạo sự tò mò, gây sốc hoặc đặt câu hỏi trực diện để giữ chân khán giả.
  2.  **Thân bài:** Chia thành các phần nhỏ (2-3 phần) để giải quyết vấn đề, cung cấp thông tin chính. Nội dung phải logic, dễ hiểu và có ví dụ minh họa.
  3.  **Kết luận:** Tóm tắt lại nội dung chính và đưa ra lời kêu gọi hành động (Call To Action) mạnh mẽ như like, share, subscribe, hoặc bình luận.

  Giọng văn cần năng động, hấp dẫn và phù hợp với nền tảng YouTube. Hãy trình bày kịch bản một cách chuyên nghiệp.`;
  
  if (provider === ApiProvider.Gemini) {
    return await callGeminiApi(prompt, options.apiKey, options.model);
  } else {
    return await callChatGptApiMock(prompt, options);
  }
};

export const validateApiKey = async (provider: ApiProvider, apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;

  if (provider === ApiProvider.Gemini) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      // A very lightweight call to check authentication
      await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Use a fast, common model for validation
        contents: 'hi',
      });
      return true; // If it doesn't throw, the key is valid
    } catch (error) {
      console.error("Gemini API Key validation failed:", error);
      return false;
    }
  } else { // ApiProvider.ChatGPT
    // Mock validation: Check if it starts with 'sk-' and has a certain length.
    console.log("Mock validating ChatGPT key...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return apiKey.startsWith('sk-') && apiKey.length > 20;
  }
};
