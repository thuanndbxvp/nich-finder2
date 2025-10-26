import { GoogleGenAI, Type } from "@google/genai";
import { ApiProvider, Niche, AiRequestOptions } from '../types';

// This is a mock function for ChatGPT as we cannot implement the actual API call.
const callChatGptApiMock = async (prompt: string, options: AiRequestOptions, schema?: any): Promise<string> => {
  console.log(`Mocking ChatGPT API call with model ${options.model} and prompt:`, prompt);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  if (prompt.includes("đề xuất 5 ngách nội dung")) {
    const mockNiches: Niche[] = [
      { title: "Thử Thách Nấu Ăn Cùng ChatGPT", description: "Người dùng đưa ra nguyên liệu, ChatGPT tạo công thức, và bạn nấu theo. Vui nhộn và bất ngờ!" },
      { title: "Lịch Sử Kể Lại Bởi ChatGPT", description: "Chọn một sự kiện lịch sử và để AI kể lại theo một phong cách độc đáo (ví dụ: hài hước, trinh thám)." },
      { title: "Du Lịch Ảo Với ChatGPT", description: "Khám phá các địa điểm nổi tiếng trên thế giới qua lời kể và kế hoạch chi tiết từ AI." },
      { title: "Sửa Chữa DIY Cùng AI", description: "Gặp vấn đề hỏng hóc trong nhà? Hỏi AI cách sửa và thực hiện theo hướng dẫn." },
      { title: "Học Kỹ Năng Mới Với ChatGPT", description: "Chọn một kỹ năng (đàn, vẽ, lập trình) và để AI hướng dẫn bạn từ đầu." },
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
      }
    },
    required: ["title", "description"]
  }
};


export const findNiches = async (topic: string, provider: ApiProvider, options: AiRequestOptions): Promise<Niche[]> => {
  const prompt = `Bạn là một chuyên gia sáng tạo nội dung YouTube. Dựa vào chủ đề chính là "${topic}", hãy đề xuất 5 ngách nội dung (niche) độc đáo, ít cạnh tranh và có tiềm năng phát triển mạnh. Với mỗi ngách, hãy cung cấp một tiêu đề thật hấp dẫn và mô tả ngắn gọn tại sao ngách này lại tiềm năng.`;

  try {
    let responseText: string;
    if (provider === ApiProvider.Gemini) {
      responseText = await callGeminiApi(prompt, options.apiKey, options.model, nicheSchema);
    } else {
      responseText = await callChatGptApiMock(prompt, options);
    }
    
    // The response is expected to be a JSON string of Niche[]
    const niches = JSON.parse(responseText);
    if (Array.isArray(niches) && niches.every(n => 'title' in n && 'description' in n)) {
      return niches;
    }
    throw new Error("Invalid niche data format received from AI.");

  } catch (error) {
    console.error(`Error finding niches with ${provider}:`, error);
    // Fallback for parsing or other errors
    throw new Error("Không thể phân tích dữ liệu ngách từ AI. Vui lòng thử lại.");
  }
};

export const writeScript = async (niche: Niche, provider: ApiProvider, options: AiRequestOptions): Promise<string> => {
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
