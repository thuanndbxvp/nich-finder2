
import { GoogleGenAI, Type } from "@google/genai";
import { ApiProvider, AnalyzedNiche, AiRequestOptions, Score } from '../types';

// This is a mock function for ChatGPT as we cannot implement the actual API call.
const callChatGptApiMock = async (prompt: string, options: AiRequestOptions, schema?: any): Promise<string> => {
  console.log(`Mocking ChatGPT API call with model ${options.model} and prompt:`, prompt);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
  const topicMatch = prompt.match(/chủ đề người dùng cung cấp là "([^"]+)"/);
  const topic = topicMatch ? topicMatch[1] : "chung";

  const generateRandomScore = (low: number, high: number): number => Math.floor(Math.random() * (high - low + 1)) + low;

  if (prompt.includes("hãy phân tích và đề xuất 10 ngách nội dung chuyên sâu")) {
    const mockNiches: AnalyzedNiche[] = Array.from({ length: 10 }, (_, i) => {
      const compScore = generateRandomScore(1, 10);
      return {
        title: `Ngách ${topic} sáng tạo #${i + 1}`,
        description: `Mô tả chi tiết cho ngách ${topic} #${i + 1}, tập trung vào một khía cạnh độc đáo và chưa được khai thác nhiều.`,
        monetization_potential: {
          score: generateRandomScore(4, 9),
          explanation: "RPM khá tốt, tiềm năng affiliate cao với các sản phẩm liên quan. Có thể bán khóa học nhỏ."
        },
        audience_potential: {
          score: generateRandomScore(5, 10),
          explanation: "Chủ đề này có thể thu hút một lượng lớn khán giả nếu nội dung chất lượng và bắt trend."
        },
        competition_level: {
          score: compScore,
          explanation: compScore > 7 ? "Cực kỳ cạnh tranh, cần sự khác biệt lớn." : (compScore > 4 ? "Cạnh tranh vừa phải, có cơ hội." : "Ít cạnh tranh, là một đại dương xanh tiềm năng.")
        },
        content_direction: "Làm video dạng top list, phân tích chuyên sâu, hoặc hướng dẫn thực hành từng bước (tutorial).",
        keywords: [
            `${topic} cho người mới bắt đầu`,
            `hướng dẫn ${topic}`,
            `mẹo ${topic} 2024`,
            `review ${topic}`,
            `${topic} là gì`
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
  const prompt = `Bạn là một chuyên gia chiến lược YouTube với kiến thức sâu rộng về các ngách (niche) thành công.
  Dựa trên chủ đề người dùng cung cấp là "${topic}", hãy phân tích và đề xuất 10 ngách nội dung chuyên sâu.
  Với mỗi ngách, hãy cung cấp thông tin chi tiết và chấm điểm theo thang điểm 1-10 theo cấu trúc JSON sau:
  1.  **title**: Tên ngách hấp dẫn.
  2.  **description**: Mô tả ngắn gọn về ngách.
  3.  **monetization_potential**: Điểm số và giải thích về tiềm năng kiếm tiền (RPM, affiliate, bán sản phẩm...). 1 là rất thấp, 10 là rất cao.
  4.  **audience_potential**: Điểm số và giải thích về tiềm năng thu hút và phát triển khán giả. 1 là ngách rất hẹp, 10 là có thể tiếp cận đại chúng.
  5.  **competition_level**: Điểm số và giải thích về mức độ cạnh tranh. QUAN TRỌNG: 1 là cạnh tranh RẤT THẤP (cơ hội tốt), 10 là CỰC KỲ cạnh tranh (rất khó để nổi bật).
  6.  **content_direction**: Gợi ý các hướng nội dung, định dạng video cụ thể.
  7.  **keywords**: Một mảng chứa khoảng 5-7 từ khóa SEO chính liên quan đến ngách.`;

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