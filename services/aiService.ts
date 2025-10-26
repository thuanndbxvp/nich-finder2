
import { GoogleGenAI, Type } from "@google/genai";
import { ApiProvider, AnalyzedNiche, AiRequestOptions } from '../types';

// This is a mock function for ChatGPT as we cannot implement the actual API call.
const callChatGptApiMock = async (prompt: string, options: AiRequestOptions, schema?: any): Promise<string> => {
  console.log(`Mocking ChatGPT API call with model ${options.model} and prompt:`, prompt);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
  const topicMatch = prompt.match(/chủ đề người dùng cung cấp là "([^"]+)"/);
  const topic = topicMatch ? topicMatch[1] : "chung";

  if (prompt.includes("hãy phân tích và đề xuất 3 ngách nội dung chuyên sâu")) {
    const mockNiches: AnalyzedNiche[] = [
      {
        title: `Trang điểm Hiệu ứng Đặc biệt (SFX) chủ đề ${topic}`,
        description: `Hướng dẫn trang điểm các nhân vật kinh dị, quái vật, hoặc các hiệu ứng vết thương giả dành cho mùa ${topic}.`,
        monetization: "RPM khá. Tiềm năng affiliate lớn cho các sản phẩm mỹ phẩm, dụng cụ hóa trang. Có thể nhận tài trợ từ các nhãn hàng.",
        content_direction: "Video tutorial (hướng dẫn), time-lapse quá trình trang điểm, review sản phẩm, biến hình thành các nhân vật nổi tiếng.",
        competition: "Cao. Cần kỹ năng trang điểm tốt và ý tưởng độc đáo. Chất lượng quay phim cận cảnh và ánh sáng là yếu tố quyết định."
      },
      {
        title: `DIY Đồ trang trí ${topic} tại nhà`,
        description: `Sáng tạo và hướng dẫn làm các món đồ trang trí ${topic} độc đáo, tiết kiệm chi phí từ những vật dụng đơn giản.`,
        monetization: "RPM trung bình. Có thể làm affiliate cho các trang bán đồ thủ công, dụng cụ. Có thể bán các bộ kit DIY hoặc sản phẩm làm sẵn trên Etsy.",
        content_direction: "Video hướng dẫn từng bước (how-to), video 'biến rác thành vàng', tổng hợp 5 ý tưởng trang trí nhanh.",
        competition: "Trung bình. Cần sự sáng tạo và khả năng quay phim đẹp mắt. Tập trung vào các ý tưởng dễ làm theo để thu hút nhiều đối tượng."
      },
      {
        title: `Kể chuyện ma/lịch sử rùng rợn về ${topic}`,
        description: `Tổng hợp và kể lại những câu chuyện ma, truyền thuyết đô thị, hoặc các sự kiện lịch sử kinh dị liên quan đến ${topic}.`,
        monetization: "RPM khá. Chủ yếu kiếm tiền từ quảng cáo YouTube. Có thể viết sách hoặc podcast nếu có lượng fan trung thành.",
        content_direction: "Video dạng kể chuyện, sử dụng giọng đọc lôi cuốn, hình ảnh minh họa, âm thanh rùng rợn để tạo không khí. Không cần lộ mặt (faceless).",
        competition: "Cao. Cạnh tranh với các kênh kể chuyện kinh dị lớn. Cần có giọng kể đặc trưng và khả năng tìm kiếm, biên tập những câu chuyện độc đáo."
      },
    ];
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
      monetization: {
        type: Type.STRING,
        description: "Đánh giá chi tiết về tiềm năng kiếm tiền của ngách, bao gồm RPM, affiliate, v.v."
      },
      content_direction: {
        type: Type.STRING,
        description: "Gợi ý về các định dạng và hướng nội dung video cụ thể."
      },
      competition: {
        type: Type.STRING,
        description: "Đánh giá mức độ cạnh tranh và đưa ra gợi ý để tạo sự khác biệt."
      }
    },
    required: ["title", "description", "monetization", "content_direction", "competition"]
  }
};


export const findNiches = async (topic: string, provider: ApiProvider, options: AiRequestOptions): Promise<AnalyzedNiche[]> => {
  const prompt = `Bạn là một chuyên gia chiến lược YouTube với kiến thức sâu rộng về các ngách (niche) thành công, bao gồm cả các ngách có RPM cao và các ý tưởng video viral.
  Dựa trên kiến thức đó và chủ đề người dùng cung cấp là "${topic}", hãy phân tích và đề xuất 3 ngách nội dung chuyên sâu.
  Với mỗi ngách, hãy cung cấp thông tin chi tiết theo cấu trúc sau:
  1.  **title**: Tên ngách hấp dẫn.
  2.  **description**: Mô tả ngắn gọn về ngách.
  3.  **monetization**: Đánh giá tiềm năng kiếm tiền (RPM ước tính, khả năng affiliate, bán sản phẩm...).
  4.  **content_direction**: Gợi ý các hướng nội dung, định dạng video cụ thể (ví dụ: video phân tích, hướng dẫn, top list...).
  5.  **competition**: Đánh giá mức độ cạnh tranh (Thấp, Trung bình, Cao) và gợi ý cách để nổi bật.`;

  try {
    let responseText: string;
    if (provider === ApiProvider.Gemini) {
      responseText = await callGeminiApi(prompt, options.apiKey, options.model, nicheSchema);
    } else {
      responseText = await callChatGptApiMock(prompt, options);
    }
    
    // The response is expected to be a JSON string of AnalyzedNiche[]
    const niches = JSON.parse(responseText);
    if (Array.isArray(niches) && niches.every(n => 'title' in n && 'description' in n && 'monetization' in n && 'content_direction' in n && 'competition' in n)) {
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
