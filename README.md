# Discord Chat Bot
Đây là một ví dụ về Discord Chat Bot dựa trên Thư viện Open AI và Discord.js. Mã này có khả năng ghi nhớ các cuộc hội thoại trước đó và có thể trả lời tương ứng

## Yêu cầu
- Một Bot Discord có Token của nó
- Open Ai API Key [Nhận khóa từ đây](https://platform.openai.com)

## Khởi động
- Tạo một tệp có tên `.env`
- Nhập các chi tiết sau vào nó:
```
token="NHẬP MÃ TOKEN BOT DISCORD"
OPENAI_API_KEY="API KEY"
```
- Trong config.json, nhập id kênh mà bạn muốn bật bot
- Lưu các tập tin. Mở Terminal trong Thư mục dự án
- Để sử dụng, hãy nhập lệnh:
```
npm i
node index.js
```

## Cấu hình
Để nhận Phản hồi tùy chỉnh, chỉ cần đi tới biến `prompt` và thay đổi mọi thứ cho phù hợp. Đừng thêm quá nhiều thông tin, nếu không bạn sẽ nhanh chóng cạn kiệt số tín dụng miễn phí của mình

## Xử lý sự cố
- Error: Status Code 500 : Điều này có nghĩa là có lỗi máy chủ từ OpenAi
- Error: Status Code 429 : Bạn đã bị giới hạn tỷ lệ từ OpenAi

## Bản quyền thuộc về @Elitex07
- Link: https://github.com/Elitex07/Chat-Gpt-Discord-Bot

