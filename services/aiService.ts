import { GoogleGenAI, Type } from "@google/genai";
import { ApiProvider, AnalyzedNiche, AiRequestOptions } from '../types';

// This is a mock function for ChatGPT as we cannot implement the actual API call.
const callChatGptApiMock = async (prompt: string, options: AiRequestOptions, schema?: any): Promise<string> => {
  console.log(`Mocking ChatGPT API call with model ${options.model} and prompt:`, prompt);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  if (prompt.includes("hãy phân tích và đề xuất 3 ngách nội dung chuyên sâu")) {
    const mockNiches: AnalyzedNiche[] = [
      {
        title: "Tài chính Cá nhân Cho Gen Z",
        description: "Hướng dẫn thế hệ trẻ về tiết kiệm, đầu tư và quản lý tiền bạc một cách dễ hiểu và gần gũi.",
        monetization: "RPM cao do chủ đề tài chính. Rất tốt cho affiliate marketing các app đầu tư, ngân hàng số. Có thể bán khóa học/ebook đơn giản.",
        content_direction: "Video dạng giải thích (explainer), hướng dẫn từng bước (how-to), review ứng dụng, phỏng vấn người trẻ thành công.",
        competition: "Trung bình. Để nổi bật, hãy tập trung vào phong cách edit trẻ trung, sử dụng meme, và các ví dụ thực tế mà Gen Z quan tâm (vd: tiết kiệm tiền đi concert)."
      },
      {
        title: "Lịch sử 'Đen' (Dark History)",
        description: "Khám phá những góc khuất, sự thật gây sốc hoặc những câu chuyện bi kịch ít người biết trong lịch sử Việt Nam và thế giới.",
        monetization: "RPM ở mức khá. Chủ yếu kiếm tiền từ quảng cáo YouTube. Khó affiliate nhưng có thể bán sách hoặc merchandise nếu xây dựng cộng đồng mạnh.",
        content_direction: "Video kể chuyện (storytelling) với hình ảnh tư liệu, animation minh họa. Cần đầu tư vào giọng đọc và kịch bản lôi cuốn.",
        competition: "Trung bình. Cần tìm những câu chuyện thật độc đáo hoặc có góc nhìn riêng, tránh các chủ đề đã quá quen thuộc. Chất lượng âm thanh và hình ảnh là chìa khóa."
      },
      {
        title: "Thử Thách Sống Tối Giản",
        description: "Thực hiện các thử thách sống tối giản trong 30 ngày và ghi lại hành trình: dọn nhà, giảm chi tiêu, detox kỹ thuật số...",
        monetization: "RPM trung bình. Tiềm năng affiliate lớn cho các sản phẩm bền vững, đồ gia dụng thông minh, sách về lối sống. Có thể tạo ra các sản phẩm số như 'Bộ kế hoạch sống tối giản'.",
        content_direction: "Định dạng Vlog, 'before-after', chia sẻ kinh nghiệm thực tế. Video cần chân thực, truyền cảm hứng và đưa ra các mẹo hữu ích.",
        competition: "Cao. Để khác biệt, hãy chọn một góc tiếp cận riêng (ví dụ: tối giản cho sinh viên, cho người đi làm bận rộn) và thể hiện cá tính mạnh mẽ."
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
