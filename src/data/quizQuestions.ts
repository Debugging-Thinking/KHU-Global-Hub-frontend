import type { BadgeId } from '../types/badge';
import type { Language } from '../types/board';

export type L10n = Record<Language, string>;

export interface LocalQuizQuestion {
  id: number;
  category: BadgeId;
  question: L10n;
  options: L10n[];
  answer: number;
  explanation: L10n;
}

// ⚠️ 자동 생성 (scripts/translate-static.ts). KO는 사람 작성, 나머지는 Azure 번역(네이티브 검수 권장).
export const LOCAL_QUIZ_QUESTIONS: LocalQuizQuestion[] = [
  {
    "id": 1,
    "category": "COURSE_REG",
    "question": {
      "KO": "신입생이 PC로만 수강신청해야 하는 이유는?",
      "EN": "Why must freshmen register for courses only on a PC?",
      "ZH": "新生为什么只能用电脑选课？",
      "VI": "Vì sao sinh viên năm nhất chỉ được đăng ký môn học trên máy tính?",
      "UZ": "Nega yangi talabalar faqat kompyuter yordamida kurslarga ro'yxatdan o'tishlari kerak?",
      "MN": "Яагаад шинэ оюутнууд зөвхөн компьютер ашиглан хичээлд бүртгүүлэх ёстой вэ?"
    },
    "options": [
      {
        "KO": "앱이 자주 오류가 나서",
        "EN": "Because the app crashes often",
        "ZH": "因为 App 经常出错",
        "VI": "Vì ứng dụng hay bị lỗi",
        "UZ": "Ilova tez-tez xatolarga duch keladi",
        "MN": "Аппликейшн байнга алдаа гаргадаг"
      },
      {
        "KO": "희망과목 담기를 사전에 진행하지 않았기 때문",
        "EN": "Because they didn't add desired courses to their wishlist in advance",
        "ZH": "因为他们事先没有把心仪课程加入愿望清单",
        "VI": "Vì họ chưa thêm môn học mong muốn vào giỏ trước đó",
        "UZ": "Buning sababi ular kerakli fanlarni oldindan tanlamagan",
        "MN": "Учир нь тэд хүссэн сэдвүүдийг урьдчилан сонгоогүй"
      },
      {
        "KO": "학교 규정상 신입생은 PC 사용 의무",
        "EN": "Because school rules require freshmen to use a PC",
        "ZH": "因为校规规定新生必须使用电脑",
        "VI": "Vì quy định của trường bắt sinh viên năm nhất phải dùng máy tính",
        "UZ": "Maktab qoidalariga ko'ra, yangi o'quvchilar kompyuterdan foydalanishlari shart.",
        "MN": "Сургуулийн дүрмийн дагуу шинэ сурагчид PC ашиглах ёстой."
      },
      {
        "KO": "모바일 앱은 2학년 이상만 사용 가능",
        "EN": "Because the mobile app is only for 2nd-year students and above",
        "ZH": "因为手机 App 仅限二年级及以上学生使用",
        "VI": "Vì ứng dụng di động chỉ dành cho sinh viên năm 2 trở lên",
        "UZ": "Mobil ilova faqat 2-sinf va undan yuqori o'quvchilar uchun mavjud.",
        "MN": "Гар утасны апп нь зөвхөн 2-р анги болон түүнээс дээш сурагчдад нээлттэй."
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "신입생은 사전 희망과목 담기를 하지 않아 PC로만 수강신청이 가능합니다.",
      "EN": "Freshmen haven't done the advance wishlist step, so they can only register on a PC.",
      "ZH": "新生没有事先进行心仪课程的预选，所以只能用电脑选课。",
      "VI": "Sinh viên năm nhất chưa thực hiện bước thêm môn vào giỏ trước nên chỉ đăng ký được trên máy tính.",
      "UZ": "Yangi o'quvchilar o'z istagan kurslarini oldindan to'ldirishlari shart emas, shuning uchun ular faqat kompyuter orqali ro'yxatdan o'tishlari mumkin.",
      "MN": "Шинэ оюутнууд хүссэн хичээлээ урьдчилан бөглөх шаардлагагүй тул зөвхөн PC-ээр бүртгүүлэх боломжтой."
    }
  },
  {
    "id": 2,
    "category": "COURSE_REG",
    "question": {
      "KO": "수강신청 정각 타이밍 확인에 권장되는 도구는?",
      "EN": "Which tool is recommended for checking the exact timing of course registration?",
      "ZH": "确认选课开始的精准时间，推荐用哪个工具？",
      "VI": "Công cụ nào được khuyên dùng để canh đúng giờ đăng ký môn học?",
      "UZ": "Kurs ro'yxatdan o'tish vaqtini tekshirish uchun qanday vositalar tavsiya etiladi?",
      "MN": "Таны хичээлийн бүртгэлийн цагийг шалгахад ямар хэрэгслүүдийг зөвлөж байна?"
    },
    "options": [
      {
        "KO": "네이버 시계",
        "EN": "Naver Clock",
        "ZH": "Naver 时钟",
        "VI": "Đồng hồ Naver",
        "UZ": "Naver Watch",
        "MN": "Naver Watch"
      },
      {
        "KO": "윈도우 내장 시계",
        "EN": "Windows built-in clock",
        "ZH": "Windows 自带时钟",
        "VI": "Đồng hồ tích hợp của Windows",
        "UZ": "Windows o'rnatilgan soat soati",
        "MN": "Windows-д суурилуулсан цаг"
      },
      {
        "KO": "네이비즘",
        "EN": "Navyism",
        "ZH": "Navyism",
        "VI": "Navyism",
        "UZ": "Dengizchilik",
        "MN": "Тэнгисийн цэргийн алба"
      },
      {
        "KO": "카카오 시계",
        "EN": "Kakao Clock",
        "ZH": "Kakao 时钟",
        "VI": "Đồng hồ Kakao",
        "UZ": "Kakao Watch",
        "MN": "Какао Вахт"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "네이비즘(밀리초 ON, 날짜 OFF)을 사용합니다. 0.001초 차이가 수백 명 순위 차이를 만듭니다.",
      "EN": "Use Navyism (milliseconds ON, date OFF). A 0.001-second difference can mean a gap of hundreds of places in line.",
      "ZH": "使用 Navyism（毫秒开启，日期关闭）。0.001 秒的差距就能拉开数百名的排名。",
      "VI": "Dùng Navyism (bật mili giây, tắt ngày). Chênh lệch 0,001 giây có thể tạo ra khoảng cách hàng trăm thứ hạng.",
      "UZ": "Navizmdan foydalanadi (millisekundlar YOQILGAN, sana O'CHIRILGAN). 0.001 soniyalik farq yuzlab reyting farqlariga olib kelishi mumkin.",
      "MN": "Navism ашигладаг (миллисекунд ON, date OFF). 0.001 секундийн ялгаа нь хэдэн зуун зэрэглэлийн ялгааг үүсгэж болно."
    }
  },
  {
    "id": 3,
    "category": "COURSE_REG",
    "question": {
      "KO": "수강신청 중 절대 눌러서는 안 되는 키는?",
      "EN": "Which key should you never press during course registration?",
      "ZH": "选课过程中绝对不能按哪个键？",
      "VI": "Phím nào tuyệt đối không được nhấn khi đang đăng ký môn học?",
      "UZ": "Kurs ro'yxatdan o'tishda qaysi tugmani hech qachon bosmaslik kerak?",
      "MN": "Хичээлийн бүртгэлийн явцад аль товчийг хэзээ ч дарах ёсгүй вэ?"
    },
    "options": [
      {
        "KO": "Enter",
        "EN": "Enter",
        "ZH": "Enter",
        "VI": "Enter",
        "UZ": "Kirish",
        "MN": "Ороорой"
      },
      {
        "KO": "Tab",
        "EN": "Tab",
        "ZH": "Tab",
        "VI": "Tab",
        "UZ": "Tab",
        "MN": "Таб"
      },
      {
        "KO": "ESC",
        "EN": "ESC",
        "ZH": "ESC",
        "VI": "ESC",
        "UZ": "ESC",
        "MN": "ESC"
      },
      {
        "KO": "F5",
        "EN": "F5",
        "ZH": "F5",
        "VI": "F5",
        "UZ": "F5",
        "MN": "F5"
      }
    ],
    "answer": 3,
    "explanation": {
      "KO": "F5(새로고침)는 절대 금지. ESC 약 1,000회 연타 시 수강신청 내역 전체 초기화.",
      "EN": "F5 (refresh) is strictly forbidden. Mashing ESC about 1,000 times resets your entire registration.",
      "ZH": "绝对禁止按 F5（刷新）。连按 ESC 约 1,000 次会把整个选课记录全部清空。",
      "VI": "Tuyệt đối cấm nhấn F5 (làm mới). Nhấn ESC khoảng 1.000 lần sẽ xóa sạch toàn bộ kết quả đăng ký.",
      "UZ": "F5 (yangilanish) qat'iyan taqiqlangan. Taxminan 1,000 ta ketma-ket ESC chaqiruvlaridan so'ng, barcha kurs ro'yxatdan o'tish ma'lumotlari qayta tiklanadi.",
      "MN": "F5 (шинэчлэх) нь хатуу хориглогдсон. Ойролцоогоор 1,000 дараалсан ESC дуудлагын дараа бүх курсын бүртгэлийн мэдээлэл дахин тохирдог."
    }
  },
  {
    "id": 4,
    "category": "COURSE_REG",
    "question": {
      "KO": "확인창이 뜨면 어떤 키로 닫고 다음 과목을 신청하나요?",
      "EN": "When the confirmation popup appears, which key do you use to close it and register the next course?",
      "ZH": "确认窗弹出后，用哪个键关闭并申请下一门课？",
      "VI": "Khi cửa sổ xác nhận hiện ra, dùng phím nào để đóng và đăng ký môn tiếp theo?",
      "UZ": "Tasdiqlash oynasi paydo bo'lganda, uni yopib, keyingi kursga ariza topshirish uchun qaysi tugmani ishlatishim kerak?",
      "MN": "Баталгаажуулах цонх гарч ирэхэд ямар түлхүүр ашиглан хааж, дараагийн хичээлд өргөдөл өгөх ёстой вэ?"
    },
    "options": [
      {
        "KO": "Enter",
        "EN": "Enter",
        "ZH": "Enter",
        "VI": "Enter",
        "UZ": "Kirish",
        "MN": "Ороорой"
      },
      {
        "KO": "ESC",
        "EN": "ESC",
        "ZH": "ESC",
        "VI": "ESC",
        "UZ": "ESC",
        "MN": "ESC"
      },
      {
        "KO": "Delete",
        "EN": "Delete",
        "ZH": "Delete",
        "VI": "Delete",
        "UZ": "O'chirish",
        "MN": "Устгах"
      },
      {
        "KO": "Space",
        "EN": "Space",
        "ZH": "空格键",
        "VI": "Space",
        "UZ": "Kosmik",
        "MN": "Орон зай"
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "확인창은 ESC로 닫고 바로 다음 학수번호를 신청합니다.",
      "EN": "Close the confirmation popup with ESC and immediately register the next course code.",
      "ZH": "用 ESC 关闭确认窗，然后立刻申请下一个学时号。",
      "VI": "Đóng cửa sổ xác nhận bằng ESC rồi đăng ký ngay mã môn tiếp theo.",
      "UZ": "ESC tasdiqlash oynasini yoping va darhol keyingi talaba raqamiga ariza bering.",
      "MN": "ESC-д баталгаажуулах цонхыг хааж, дараагийн оюутны дугаарыг шууд авах хүсэлт гаргана."
    }
  },
  {
    "id": 5,
    "category": "COURSE_REG",
    "question": {
      "KO": "취소지연제는 몇 시경부터 적용되나요?",
      "EN": "Around what time does the cancellation-delay system take effect?",
      "ZH": "取消延迟制大约从几点开始生效？",
      "VI": "Chế độ hoãn hủy bắt đầu áp dụng vào khoảng mấy giờ?",
      "UZ": "Bekor qilish kechikish tizimi qachon kuchga kiradi?",
      "MN": "Цуцлах хойшлуулалтын систем хэдэн цагаас хүчин төгөлдөр болдог вэ?"
    },
    "options": [
      {
        "KO": "10시",
        "EN": "10:00",
        "ZH": "10:00",
        "VI": "10:00",
        "UZ": "10:00",
        "MN": "10:00"
      },
      {
        "KO": "11시",
        "EN": "11:00",
        "ZH": "11:00",
        "VI": "11:00",
        "UZ": "11:00",
        "MN": "11:00"
      },
      {
        "KO": "11시 30분",
        "EN": "11:30",
        "ZH": "11:30",
        "VI": "11:30",
        "UZ": "11:30",
        "MN": "11:30 AM"
      },
      {
        "KO": "12시",
        "EN": "12:00",
        "ZH": "12:00",
        "VI": "12:00",
        "UZ": "12:00",
        "MN": "12:00"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "11시 30분경부터 취소지연제가 적용되어 취소된 자리를 일정 시간 후 확보 가능합니다.",
      "EN": "The cancellation-delay system kicks in around 11:30, so a dropped seat can be claimed after a set delay.",
      "ZH": "大约从 11:30 开始实行取消延迟制，被退掉的名额要过一段时间后才能抢到。",
      "VI": "Chế độ hoãn hủy bắt đầu từ khoảng 11:30, nên chỗ bị hủy chỉ có thể giành lại sau một khoảng thời gian.",
      "UZ": "Taxminan 11:30 dan boshlab, bekor qilish uchun kechikish siyosati amal qiladi, bu bekor qilingan o'rinlarni ma'lum muddatdan so'ng ta'minlash imkonini beradi.",
      "MN": "Ойролцоогоор 11:30-аас эхлэн цуцлалыг хойшлуулах бодлого хэрэгжиж, цуцлагдсан суудлыг тодорхой хугацааны дараа баталгаажуулах боломжтой."
    }
  },
  {
    "id": 6,
    "category": "COURSE_REG",
    "question": {
      "KO": "학점세이브제 활용 시 다음 학기 최대 신청 가능 학점은?",
      "EN": "Using the Credit Save System, what's the maximum number of credits you can register for next semester?",
      "ZH": "使用学分储蓄制时，下学期最多可申请多少学分？",
      "VI": "Khi dùng chế độ lưu tín chỉ, học kỳ sau được đăng ký tối đa bao nhiêu tín chỉ?",
      "UZ": "Kredit saqlash tizimidan foydalanganda keyingi semestrda maksimal kredit qancha bo'ladi?",
      "MN": "Кредит хадгалах системийг ашиглан ирэх улиралд хамгийн их кредит хэд вэ?"
    },
    "options": [
      {
        "KO": "18학점",
        "EN": "18 credits",
        "ZH": "18 学分",
        "VI": "18 tín chỉ",
        "UZ": "18 ta kredit",
        "MN": "18 кредит"
      },
      {
        "KO": "19학점",
        "EN": "19 credits",
        "ZH": "19 学分",
        "VI": "19 tín chỉ",
        "UZ": "19 ta kredit",
        "MN": "19 кредит"
      },
      {
        "KO": "20학점",
        "EN": "20 credits",
        "ZH": "20 学分",
        "VI": "20 tín chỉ",
        "UZ": "20 ta kredit",
        "MN": "20 кредит"
      },
      {
        "KO": "21학점",
        "EN": "21 credits",
        "ZH": "21 学分",
        "VI": "21 tín chỉ",
        "UZ": "21 ta kredit",
        "MN": "21 кредит"
      }
    ],
    "answer": 3,
    "explanation": {
      "KO": "F학점 없이 학점 부족 시 학점세이브제로 다음 학기 최대 21학점 신청 가능합니다.",
      "EN": "If you're short on credits with no F grades, the Credit Save System lets you register for up to 21 credits next semester.",
      "ZH": "在没有 F 等级却学分不足的情况下，可通过学分储蓄制在下学期最多申请 21 学分。",
      "VI": "Nếu thiếu tín chỉ mà không có điểm F, chế độ lưu tín chỉ cho phép đăng ký tối đa 21 tín chỉ vào học kỳ sau.",
      "UZ": "Agar F bahosi bo'lmasa, yetarli kredit bo'lmasa, keyingi semestrda Grade Save Zero yordamida 21 kreditgacha ariza topshirishingiz mumkin.",
      "MN": "Хэрэв танд F үнэлгээ байхгүй хангалттай кредит дутмаг бол дараагийн улиралд Grade Save Zero ашиглан 21 хүртэл кредит авах боломжтой."
    }
  },
  {
    "id": 7,
    "category": "TRANSPORT",
    "question": {
      "KO": "경희대 교내 구간 버스를 무료로 타는 방법은?",
      "EN": "How do you ride the bus for free within the KHU campus section?",
      "ZH": "在庆熙大学校内路段免费乘公交的方法是？",
      "VI": "Làm sao để đi xe buýt miễn phí trong đoạn nội khu ĐH Kyung Hee?",
      "UZ": "Kyung Hee universitetining kampusdagi avtobusiga qanday bepul minaman?",
      "MN": "Кён Хи их сургуулийн их сургуулийн шаттл автобусанд үнэгүй яаж суух вэ?"
    },
    "options": [
      {
        "KO": "학생증을 기사님께 보여준다",
        "EN": "Show your student ID to the driver",
        "ZH": "向司机出示学生证",
        "VI": "Cho tài xế xem thẻ sinh viên",
        "UZ": "Haydovchiga talabalik guvohnomangizni ko'rsating.",
        "MN": "Жолоочид оюутны үнэмлэхээ үзүүл."
      },
      {
        "KO": "카드를 찍지 않는다",
        "EN": "Don't tap your card",
        "ZH": "不刷卡",
        "VI": "Không quẹt thẻ",
        "UZ": "Karta olma",
        "MN": "Карт битгий аваарай"
      },
      {
        "KO": "앱에서 쿠폰을 발급받는다",
        "EN": "Get a coupon from an app",
        "ZH": "在 App 上领取优惠券",
        "VI": "Nhận phiếu giảm giá trên ứng dụng",
        "UZ": "Ilova orqali berilgan kuponlarni oling",
        "MN": "Апп-аар дамжуулан купон аваарай"
      },
      {
        "KO": "기사님께 학생임을 말한다",
        "EN": "Tell the driver you're a student",
        "ZH": "告诉司机你是学生",
        "VI": "Nói với tài xế rằng bạn là sinh viên",
        "UZ": "Haydovchiga talaba ekanligingizni ayting.",
        "MN": "Жолоочид чи оюутан гэдгээ хэлээрэй."
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "교내 구간은 카드를 찍지 않으면 무료입니다.",
      "EN": "The on-campus section is free as long as you don't tap your card.",
      "ZH": "校内路段只要不刷卡就是免费的。",
      "VI": "Đoạn trong khuôn viên là miễn phí miễn là bạn không quẹt thẻ.",
      "UZ": "Kampus bo'limi bepul, agar kartangizga tegmasangiz.",
      "MN": "Кампусын хэсэг нь карт тоглуулахгүй бол үнэгүй."
    }
  },
  {
    "id": 8,
    "category": "TRANSPORT",
    "question": {
      "KO": "1550-1 버스에서 강남 방면으로 탑승하는 정류장은?",
      "EN": "Which stop do you board the 1550-1 bus at when heading toward Gangnam?",
      "ZH": "乘 1550-1 路公交去江南方向应在哪一站上车？",
      "VI": "Lên xe buýt 1550-1 đi hướng Gangnam tại trạm nào?",
      "UZ": "Gangnam tomon ketayotgan 1550-1 avtobusiga chiqish uchun to'xtash joyi qayerda?",
      "MN": "Гангнам руу чиглэсэн 1550-1 автобусанд суух зогсоол хаана байдаг вэ?"
    },
    "options": [
      {
        "KO": "정건(경희대학교)",
        "EN": "Jeonggeon (Kyung Hee University)",
        "ZH": "正建（庆熙大学）",
        "VI": "Jeonggeon (Đại học Kyung Hee)",
        "UZ": "Jung Geon (Kyung Hee Universiteti)",
        "MN": "Жүн Гён (Кён Хи их сургууль)"
      },
      {
        "KO": "영통역 8번 출구",
        "EN": "Yeongtong Station Exit 8",
        "ZH": "永通站 8 号出口",
        "VI": "Ga Yeongtong Lối ra 8",
        "UZ": "Yeongtong vokzali 8-chi chiqish",
        "MN": "Ёнтонг өртөөний 8-р гарц"
      },
      {
        "KO": "정문(경희대정문)",
        "EN": "Front Gate (KHU Front Gate)",
        "ZH": "正门（庆熙大学正门）",
        "VI": "Cổng chính (Cổng chính ĐH Kyung Hee)",
        "UZ": "Asosiy darvoza (Kyunghee universiteti asosiy darvozasi)",
        "MN": "Гол хаалга (Кёнхи их сургуулийн гол хаалга)"
      },
      {
        "KO": "학생회관 앞",
        "EN": "In front of the student union building",
        "ZH": "学生会馆前",
        "VI": "Trước tòa nhà hội sinh viên",
        "UZ": "Talabalar ittifoqi binosi oldida",
        "MN": "Оюутны холбооны барилгын өмнө"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "강남 방면 → 정문(경희대정문 정류장), 한신대 방면 → 정건(경희대학교 정류장).",
      "EN": "Toward Gangnam → Front Gate (KHU Front Gate stop); toward Hanshin Univ. → Jeonggeon (Kyung Hee University stop).",
      "ZH": "江南方向 → 正门（庆熙大学正门站）；韩神大学方向 → 正建（庆熙大学站）。",
      "VI": "Hướng Gangnam → Cổng chính (trạm Cổng chính ĐH Kyung Hee); hướng ĐH Hanshin → Jeonggeon (trạm Đại học Kyung Hee).",
      "UZ": "Gangnam yo'nalishi→ Asosiy darvoza (Kyung Hee universiteti asosiy darvozasi bekati), Hanshin universiteti yo'nalishi → Jeonggeon (Kyung Hee universiteti avtobus bekati).",
      "MN": "Гангнам чиглэл→ Гол хаалга (Кён Хи их сургуулийн гол хаалганы буудал), Ханшин их сургуулийн чиглэл → Жонгён (Кён Хи их сургуулийн автобусны буудал)."
    }
  },
  {
    "id": 9,
    "category": "TRANSPORT",
    "question": {
      "KO": "G5100 버스의 특징은?",
      "EN": "What's special about the G5100 bus?",
      "ZH": "G5100 路公交有什么特点？",
      "VI": "Xe buýt G5100 có đặc điểm gì?",
      "UZ": "G5100 avtobusining xususiyatlari qanday?",
      "MN": "G5100 автобусны онцлог шинж чанарууд юу вэ?"
    },
    "options": [
      {
        "KO": "교내 무료 구간이 없음",
        "EN": "It has no free on-campus section",
        "ZH": "没有校内免费路段",
        "VI": "Không có đoạn miễn phí trong khuôn viên",
        "UZ": "Kampusda bo'sh bo'limlar yo'q",
        "MN": "Кампус дээр үнэгүй хэсэг байхгүй"
      },
      {
        "KO": "2층 버스",
        "EN": "It's a double-decker bus",
        "ZH": "双层巴士",
        "VI": "Là xe buýt hai tầng",
        "UZ": "Ikki qavatli avtobus",
        "MN": "Хоёр давхар автобус"
      },
      {
        "KO": "M버스(광역급행)",
        "EN": "It's an M-Bus (Metropolitan Express)",
        "ZH": "M 巴士（广域急行）",
        "VI": "Là xe buýt M (tốc hành liên vùng)",
        "UZ": "M Bus (Metropolitan Express)",
        "MN": "M автобус (Метрополитан Экспресс)"
      },
      {
        "KO": "경희대 기점이 아님",
        "EN": "It doesn't start from KHU",
        "ZH": "始发站不是庆熙大学",
        "VI": "Không xuất phát từ ĐH Kyung Hee",
        "UZ": "Kyung Hee universitetining boshlang'ich nuqtasi emas",
        "MN": "Кён Хи Их Сургуулийн эхлэл биш"
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "G5100은 강남행 2층 버스입니다.",
      "EN": "The G5100 is a double-decker bus bound for Gangnam.",
      "ZH": "G5100 是开往江南的双层巴士。",
      "VI": "G5100 là xe buýt hai tầng đi Gangnam.",
      "UZ": "G5100 — Gangnamga yo'l olgan ikki qavatli avtobus.",
      "MN": "G5100 нь Гангнам руу чиглэсэн хоёр давхар автобус юм."
    }
  },
  {
    "id": 10,
    "category": "TRANSPORT",
    "question": {
      "KO": "영통역에서 경희대 정문까지 도보로 약 몇 분 걸리나요?",
      "EN": "About how many minutes is the walk from Yeongtong Station to the KHU Front Gate?",
      "ZH": "从永通站步行到庆熙大学正门大约要几分钟？",
      "VI": "Đi bộ từ ga Yeongtong đến Cổng chính ĐH Kyung Hee mất khoảng bao nhiêu phút?",
      "UZ": "Yeongtong stansiyasidan Kyung Hee universitetining asosiy darvozasigacha piyoda yurish uchun qancha daqiqa ketadi?",
      "MN": "Ёнтон өртөөнөөс Кён Хи их сургуулийн гол хаалга хүртэл хэдэн минут алхах вэ?"
    },
    "options": [
      {
        "KO": "5분",
        "EN": "5 minutes",
        "ZH": "5 分钟",
        "VI": "5 phút",
        "UZ": "5 daqiqa",
        "MN": "5 минут"
      },
      {
        "KO": "10분",
        "EN": "10 minutes",
        "ZH": "10 分钟",
        "VI": "10 phút",
        "UZ": "10 daqiqa",
        "MN": "10 минут"
      },
      {
        "KO": "15분",
        "EN": "15 minutes",
        "ZH": "15 分钟",
        "VI": "15 phút",
        "UZ": "15 daqiqa",
        "MN": "15 минут"
      },
      {
        "KO": "25분",
        "EN": "25 minutes",
        "ZH": "25 分钟",
        "VI": "25 phút",
        "UZ": "25 daqiqa",
        "MN": "25 минут"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "영통역에서 학교 정문까지 도보 약 15분 거리입니다.",
      "EN": "It's about a 15-minute walk from Yeongtong Station to the school's front gate.",
      "ZH": "从永通站到学校正门步行约 15 分钟。",
      "VI": "Từ ga Yeongtong đến cổng chính của trường mất khoảng 15 phút đi bộ.",
      "UZ": "Yeongtong stansiyasidan maktabning asosiy darvozasigacha taxminan 15 daqiqalik piyoda masofa bor.",
      "MN": "Ёнтонг өртөөнөөс сургуулийн гол хаалга хүртэл ойролцоогоор 15 минутын алхах зайтай."
    }
  },
  {
    "id": 11,
    "category": "TRANSPORT",
    "question": {
      "KO": "지각 직전, 영통역에서 가장 빠르게 캠퍼스에 도달하는 방법은?",
      "EN": "When you're about to be late, what's the fastest way to get from Yeongtong Station to campus?",
      "ZH": "快迟到时，从永通站最快到达校园的方法是？",
      "VI": "Khi sắp muộn giờ, cách nhanh nhất để từ ga Yeongtong đến trường là gì?",
      "UZ": "Kechikishdan oldin, Yeongtong stansiyasidan kampusga eng tez qanday yetib borish mumkin?",
      "MN": "Хоцорохоос өмнө, Ёнтонг өртөөнөөс кампус руу хамгийн хурдан хүрэх арга юу вэ?"
    },
    "options": [
      {
        "KO": "6번 출구 310번 버스",
        "EN": "Exit 6, bus 310",
        "ZH": "6 号出口 310 路公交",
        "VI": "Lối ra 6, xe buýt 310",
        "UZ": "6-chi chiqish, 310-avtobus",
        "MN": "6-р гарам, 310-р автобус"
      },
      {
        "KO": "6번 출구 900번 버스",
        "EN": "Exit 6, bus 900",
        "ZH": "6 号出口 900 路公交",
        "VI": "Lối ra 6, xe buýt 900",
        "UZ": "6-chi chiqish, 900-raqamli avtobus",
        "MN": "6-р гарц, 900-р автобус"
      },
      {
        "KO": "8번 출구 빨간 버스(유료)",
        "EN": "Exit 8, red bus (paid)",
        "ZH": "8 号出口 红色巴士（收费）",
        "VI": "Lối ra 8, xe buýt đỏ (mất phí)",
        "UZ": "8-chi chiqish: Qizil avtobus (to'langan)",
        "MN": "8-р гарц: Улаан автобус (Төлбөртэй)"
      },
      {
        "KO": "도보",
        "EN": "On foot",
        "ZH": "步行",
        "VI": "Đi bộ",
        "UZ": "Piyoda",
        "MN": "Явган"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "급할 때는 8번 출구에서 빨간 버스(직행좌석버스)를 타는 것이 가장 빠릅니다. 단, 요금이 발생합니다.",
      "EN": "When you're in a rush, the fastest option is the red bus (express seated bus) from Exit 8. Note that a fare applies.",
      "ZH": "赶时间时，从 8 号出口坐红色巴士（直达座席巴士）最快。不过要收费。",
      "VI": "Khi gấp, nhanh nhất là đi xe buýt đỏ (xe ghế ngồi tốc hành) từ Lối ra 8. Tuy nhiên sẽ mất phí.",
      "UZ": "Agar shoshilayotgan bo'lsangiz, eng tez yo'l 8-chi chiqishdan qizil avtobusga (to'g'ridan-to'g'ri o'rindiqli avtobus) minishdir. Biroq, to'lovlar qo'llaniladi.",
      "MN": "Хэрвээ яаралтай байвал хамгийн хурдан арга нь 8-р гарцаас улаан автобус (шууд суудалтай автобус) суух явдал юм. Гэсэн хэдий ч төлбөр шаарддаг."
    }
  },
  {
    "id": 12,
    "category": "FOOD",
    "question": {
      "KO": "가성비 점심 특선(6,900원)으로 유명한 식당은?",
      "EN": "Which restaurant is famous for its value-for-money lunch special (₩6,900)?",
      "ZH": "以高性价比午餐特价（6,900 韩元）闻名的餐厅是？",
      "VI": "Quán nào nổi tiếng với suất trưa đặc biệt giá hời (6.900 won)?",
      "UZ": "Qaysi restoran o'zining pulga arzon tushlik maxsus taomi (6,900 von) bilan mashhur?",
      "MN": "Ямар ресторан нь 6,900 вонгийн үнэ цэнэтэй үдийн хоолны онцгой санал санал болгож алдартай вэ?"
    },
    "options": [
      {
        "KO": "사담손만두",
        "EN": "Sadamson Mandu",
        "ZH": "萨达姆孙饺子",
        "VI": "Sadamson Mandu",
        "UZ": "Sadam Son Dumplings",
        "MN": "Sadam Son Dumplings"
      },
      {
        "KO": "천보현",
        "EN": "Cheonbohyeon",
        "ZH": "千宝贤",
        "VI": "Cheonbohyeon",
        "UZ": "Cheon Bo-hyun",
        "MN": "Чон Бо-хён"
      },
      {
        "KO": "부대통령",
        "EN": "Budaetongnyeong",
        "ZH": "副大统领",
        "VI": "Budaetongnyeong",
        "UZ": "Vitse-prezident",
        "MN": "Дэд ерөнхийлөгч"
      },
      {
        "KO": "밥은화",
        "EN": "Babeunhwa",
        "ZH": "Bap Eunhwa",
        "VI": "Bap Eunhwa",
        "UZ": "Eunhwa Bab",
        "MN": "Ынхва Баб"
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "천보현의 육회비빔밥+차돌된장찌개 점심특선 6,900원이 유명합니다.",
      "EN": "Cheonbohyeon's yukhoe bibimbap + brisket doenjang stew lunch special for ₩6,900 is famous.",
      "ZH": "千宝贤的生牛肉拌饭 + 牛胸肉大酱汤午餐特价 6,900 韩元很有名。",
      "VI": "Suất trưa đặc biệt cơm trộn thịt bò sống + canh tương đậu ức bò giá 6.900 won của Cheonbohyeon rất nổi tiếng.",
      "UZ": "Cheon Bo-hyunning Yukhoe Bibimbap + Brisket Doenjang Stew Lunch Special 6,900 von uchun mashhur.",
      "MN": "Чон Бо-хёны Yukhoe Bibimbap + Brisket Doenjang Stew Lunch тусгай 6,900 вонтой алдартай."
    }
  },
  {
    "id": 13,
    "category": "FOOD",
    "question": {
      "KO": "마라탕 맛집으로 정평이 나 있는 식당은?",
      "EN": "Which restaurant has a solid reputation as a malatang spot?",
      "ZH": "以麻辣烫闻名、口碑很好的餐厅是？",
      "VI": "Quán nào được công nhận là quán malatang ngon?",
      "UZ": "Qaysi restoran o'zining malatang maxsus taomlari bilan mashhur?",
      "MN": "Малатангийн онцгой хоолоороо аль ресторан алдартай вэ?"
    },
    "options": [
      {
        "KO": "겐코",
        "EN": "Genko",
        "ZH": "源光",
        "VI": "Genko",
        "UZ": "Genko",
        "MN": "Генко"
      },
      {
        "KO": "얜시부",
        "EN": "Yaensibu",
        "ZH": "Yaensibu",
        "VI": "Yaensibu",
        "UZ": "Yapsibu",
        "MN": "Япсибу"
      },
      {
        "KO": "부타센세",
        "EN": "Buta Sensei",
        "ZH": "Buta 老师",
        "VI": "Buta Sensei",
        "UZ": "Buta Sensei",
        "MN": "Бута Сэнсэй"
      },
      {
        "KO": "쿠지라",
        "EN": "Kujira",
        "ZH": "Kujira",
        "VI": "Kujira",
        "UZ": "Kujira",
        "MN": "Кужира"
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "얜시부는 마라탕 맛집으로 마라탕+계란볶음밥 조합이 특히 인기입니다.",
      "EN": "Yaensibu is a go-to malatang spot, and its malatang + egg fried rice combo is especially popular.",
      "ZH": "Yaensibu 是有名的麻辣烫店，麻辣烫配蛋炒饭的组合尤其受欢迎。",
      "VI": "Yaensibu là quán malatang ngon, combo malatang + cơm chiên trứng đặc biệt được ưa chuộng.",
      "UZ": "Yapsibu mashhur malatang restorani bo'lib, uning malatang + tuxumli qovurilgan guruch kombinatsiyasi ayniqsa mashhur.",
      "MN": "Япсибу нь алдартай малатангийн ресторан бөгөөд малатанг + өндөгтэй шарсан будааны хослол нь онцгой алдартай."
    }
  },
  {
    "id": 14,
    "category": "FOOD",
    "question": {
      "KO": "밥 무한리필이 가능한 식당은?",
      "EN": "Which restaurant offers unlimited rice refills?",
      "ZH": "哪家餐厅可以无限续米饭？",
      "VI": "Quán nào cho thêm cơm không giới hạn?",
      "UZ": "Qaysi restoranlar cheksiz guruch to'ldirish xizmatlarini taklif qiladi?",
      "MN": "Ямар ресторанууд хязгааргүй будаа дүүргэх санал болгодог вэ?"
    },
    "options": [
      {
        "KO": "사담손만두",
        "EN": "Sadamson Mandu",
        "ZH": "萨达姆孙饺子",
        "VI": "Sadamson Mandu",
        "UZ": "Sadam Son Dumplings",
        "MN": "Sadam Son Dumplings"
      },
      {
        "KO": "전주본가",
        "EN": "Jeonju Bonga",
        "ZH": "全州本家",
        "VI": "Jeonju Bonga",
        "UZ": "Jeonju Asosiy Uyi",
        "MN": "Жонжу гол ордон"
      },
      {
        "KO": "부대통령",
        "EN": "Budaetongnyeong",
        "ZH": "副大统领",
        "VI": "Budaetongnyeong",
        "UZ": "Vitse-prezident",
        "MN": "Дэд ерөнхийлөгч"
      },
      {
        "KO": "청진옥",
        "EN": "Cheongjinok",
        "ZH": "青津屋",
        "VI": "Cheongjinok",
        "UZ": "Cheong Jin-ok",
        "MN": "Чон Жин-ок"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "부대통령은 밥 무한리필이 가능합니다.",
      "EN": "Budaetongnyeong offers unlimited rice refills.",
      "ZH": "副大统领可以无限续米饭。",
      "VI": "Budaetongnyeong cho thêm cơm không giới hạn.",
      "UZ": "Vitse-prezident cheksiz guruch to'ldirishdan bahramand bo'lishi mumkin.",
      "MN": "Дэд ерөнхийлөгч хязгааргүй будаа дүүргэх боломжтой."
    }
  },
  {
    "id": 15,
    "category": "FOOD",
    "question": {
      "KO": "영통 유일의 텐동 전문점은?",
      "EN": "What is the only tendon specialist in Yeongtong?",
      "ZH": "永通唯一的天妇罗盖饭专门店是？",
      "VI": "Quán tendon duy nhất ở Yeongtong là quán nào?",
      "UZ": "Yeongtongdagi yagona tendonli maxsus restoran qaysi?",
      "MN": "Ёнтонгийн цорын ганц шөрмөсний тусгай ресторан юу вэ?"
    },
    "options": [
      {
        "KO": "미미카츠",
        "EN": "Mimikatsu",
        "ZH": "Mimikatsu",
        "VI": "Mimikatsu",
        "UZ": "Mimikatsu",
        "MN": "Мимикацу"
      },
      {
        "KO": "부타센세",
        "EN": "Buta Sensei",
        "ZH": "Buta 老师",
        "VI": "Buta Sensei",
        "UZ": "Buta Sensei",
        "MN": "Бута Сэнсэй"
      },
      {
        "KO": "쿠지라",
        "EN": "Kujira",
        "ZH": "Kujira",
        "VI": "Kujira",
        "UZ": "Kujira",
        "MN": "Кужира"
      },
      {
        "KO": "겐코",
        "EN": "Genko",
        "ZH": "源光",
        "VI": "Genko",
        "UZ": "Genko",
        "MN": "Генко"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "쿠지라는 영통에서 유일한 텐동 전문점입니다.",
      "EN": "Kujira is the only tendon specialist in Yeongtong.",
      "ZH": "Kujira 是永通唯一的天妇罗盖饭专门店。",
      "VI": "Kujira là quán tendon duy nhất ở Yeongtong.",
      "UZ": "Kujira Yeongtongdagi yagona tendon maxsus restoranidir.",
      "MN": "Кужира бол Ёнтонг хотын цорын ганц шөрмөсний тусгай ресторан юм."
    }
  },
  {
    "id": 16,
    "category": "CAMPUS_SITE",
    "question": {
      "KO": "수강신청, 성적 조회, 학사 일정을 모두 처리하는 사이트는?",
      "EN": "Which site handles course registration, grade lookup, and the academic calendar all in one?",
      "ZH": "选课、成绩查询、学务日程都能办理的网站是？",
      "VI": "Trang web nào xử lý cả đăng ký môn, tra cứu điểm và lịch học vụ?",
      "UZ": "Qaysi sayt kurs ro'yxati, baho so'rovi va akademik jadvalni boshqaradi?",
      "MN": "Ямар сайт хичээлийн бүртгэл, дүнгийн асуулт, академик хуваарийг хариуцдаг вэ?"
    },
    "options": [
      {
        "KO": "e-Campus",
        "EN": "e-Campus",
        "ZH": "e-Campus",
        "VI": "e-Campus",
        "UZ": "e-Kampus",
        "MN": "e-Campus"
      },
      {
        "KO": "인포21(Info21)",
        "EN": "Info21",
        "ZH": "Info21",
        "VI": "Info21",
        "UZ": "Info21",
        "MN": "Мэдээлэл21"
      },
      {
        "KO": "경희대 공식 홈페이지",
        "EN": "KHU official website",
        "ZH": "庆熙大学官方网站",
        "VI": "Trang chính thức của ĐH Kyung Hee",
        "UZ": "Kyung Hee Universiteti rasmiy veb-sayti",
        "MN": "Кён Хи Их Сургуулийн албан ёсны вэбсайт"
      },
      {
        "KO": "에브리타임",
        "EN": "Everytime",
        "ZH": "Everytime",
        "VI": "Everytime",
        "UZ": "Har safar",
        "MN": "Үргэлж"
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "인포21(info21.khu.ac.kr)은 수강신청·성적·학사 일정 등 학사 전반을 관리합니다.",
      "EN": "Info21 (info21.khu.ac.kr) manages academic affairs overall, including course registration, grades, and the academic calendar.",
      "ZH": "Info21（info21.khu.ac.kr）管理选课、成绩、学务日程等整体学务事项。",
      "VI": "Info21 (info21.khu.ac.kr) quản lý toàn bộ học vụ như đăng ký môn, điểm số, lịch học vụ.",
      "UZ": "Info21 (info21.khu.ac.kr) butun akademik tizimni, jumladan kurslarni ro'yxatdan o'tkazish, baholar va o'quv jadvalini boshqaradi.",
      "MN": "Info21 (info21.khu.ac.kr) нь бүх академик системийг, хичээлийн бүртгэл, дүн, академик хуваарийг удирддаг."
    }
  },
  {
    "id": 17,
    "category": "CAMPUS_SITE",
    "question": {
      "KO": "그룹 스터디룸 온라인 예약이 가능한 사이트는?",
      "EN": "Which site lets you book group study rooms online?",
      "ZH": "可以在线预约团体自习室的网站是？",
      "VI": "Trang web nào cho phép đặt phòng học nhóm trực tuyến?",
      "UZ": "Qaysi saytlar guruhli o'quv xonalari uchun onlayn bron qilishga ruxsat beradi?",
      "MN": "Ямар сайтууд бүлгийн хичээлийн өрөөнд онлайн захиалга хийх боломжтой вэ?"
    },
    "options": [
      {
        "KO": "인포21",
        "EN": "Info21",
        "ZH": "Info21",
        "VI": "Info21",
        "UZ": "Info21",
        "MN": "Мэдээлэл21"
      },
      {
        "KO": "lib.khu.ac.kr",
        "EN": "lib.khu.ac.kr",
        "ZH": "lib.khu.ac.kr",
        "VI": "lib.khu.ac.kr",
        "UZ": "lib.khu.ac.kr",
        "MN": "lib.khu.ac.kr"
      },
      {
        "KO": "khu-kr.libcal.com",
        "EN": "khu-kr.libcal.com",
        "ZH": "khu-kr.libcal.com",
        "VI": "khu-kr.libcal.com",
        "UZ": "khu-kr.libcal.com",
        "MN": "khu-kr.libcal.com"
      },
      {
        "KO": "khucoop.com",
        "EN": "khucoop.com",
        "ZH": "khucoop.com",
        "VI": "khucoop.com",
        "UZ": "khucoop.com",
        "MN": "khucoop.com"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "스터디룸 예약은 khu-kr.libcal.com에서 가능합니다.",
      "EN": "Study room reservations are made at khu-kr.libcal.com.",
      "ZH": "自习室预约可在 khu-kr.libcal.com 进行。",
      "VI": "Việc đặt phòng học được thực hiện tại khu-kr.libcal.com.",
      "UZ": "O'qish xonasini band qilish uchun khu-kr.libcal.com mavjud.",
      "MN": "Судалгааны өрөөний захиалга khu-kr.libcal.com."
    }
  },
  {
    "id": 18,
    "category": "CAMPUS_SITE",
    "question": {
      "KO": "귀향버스 예약, 학생식당 정보를 제공하는 사이트는?",
      "EN": "Which site provides hometown bus reservations and student cafeteria info?",
      "ZH": "提供返乡巴士预约和学生食堂信息的网站是？",
      "VI": "Trang web nào cung cấp đặt xe buýt về quê và thông tin căng tin sinh viên?",
      "UZ": "Qaysi saytlar uyga qaytish avtobuslari va talabalar kafeteriyalari haqida ma'lumot beradi?",
      "MN": "Ямар сайтууд гэрийн автобусны захиалга болон оюутны хоолны газруудын талаар мэдээлэл өгдөг вэ?"
    },
    "options": [
      {
        "KO": "인포21",
        "EN": "Info21",
        "ZH": "Info21",
        "VI": "Info21",
        "UZ": "Info21",
        "MN": "Мэдээлэл21"
      },
      {
        "KO": "에브리타임",
        "EN": "Everytime",
        "ZH": "Everytime",
        "VI": "Everytime",
        "UZ": "Har safar",
        "MN": "Үргэлж"
      },
      {
        "KO": "생협(khucoop.com)",
        "EN": "Co-op (khucoop.com)",
        "ZH": "生协（khucoop.com）",
        "VI": "Hợp tác xã (khucoop.com)",
        "UZ": "Kooperativ (khucoop.com)",
        "MN": "Хамтын ажиллагаа (khucoop.com)"
      },
      {
        "KO": "e-Campus",
        "EN": "e-Campus",
        "ZH": "e-Campus",
        "VI": "e-Campus",
        "UZ": "e-Kampus",
        "MN": "e-Campus"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "생협(khucoop.com)에서 귀향버스 예약, 매점·식당 정보를 확인할 수 있습니다.",
      "EN": "At the co-op (khucoop.com) you can reserve the hometown bus and check store and cafeteria info.",
      "ZH": "在生协（khucoop.com）可以预约返乡巴士，查看便利店和食堂信息。",
      "VI": "Tại hợp tác xã (khucoop.com), bạn có thể đặt xe buýt về quê và xem thông tin cửa hàng, căng tin.",
      "UZ": "Uyga ketuvchi avtobusni bron qilishingiz mumkin, kooperativda do'kon va restoranlar haqida ma'lumotlarni tekshirishingiz mumkin (khucoop.com).",
      "MN": "Гэртээ буцах автобусыг захиалж, дэлгүүр, ресторануудын мэдээллийг co-op (khucoop.com) дээр шалгаж болно."
    }
  },
  {
    "id": 19,
    "category": "CAMPUS_SITE",
    "question": {
      "KO": "휴학·복학·학적 변동 등 행정 처리를 위한 사이트는?",
      "EN": "Which site is for administrative tasks like taking leave, returning to school, and enrollment changes?",
      "ZH": "办理休学、复学、学籍变动等行政事务的网站是？",
      "VI": "Trang web nào dùng để xử lý hành chính như nghỉ học, học lại, thay đổi học bạ?",
      "UZ": "Qaysi sayt ma'muriy jarayonlar, masalan, ta'til, tiklash yoki ro'yxatdan o'tishdagi o'zgarishlar uchun ishlatiladi?",
      "MN": "Ямар сайтыг удирдлагын үйл ажиллагаанд ашигладаг вэ, жишээ нь чөлөө, дахин ажилд орох, бүртгэлийн өөрчлөлт хийх зэрэг?"
    },
    "options": [
      {
        "KO": "인포21",
        "EN": "Info21",
        "ZH": "Info21",
        "VI": "Info21",
        "UZ": "Info21",
        "MN": "Мэдээлэл21"
      },
      {
        "KO": "학사지원과(ghaksa.khu.ac.kr)",
        "EN": "Academic Affairs Office (ghaksa.khu.ac.kr)",
        "ZH": "学务支援科（ghaksa.khu.ac.kr）",
        "VI": "Phòng Hỗ trợ Học vụ (ghaksa.khu.ac.kr)",
        "UZ": "Akademik Qo'llab-quvvatlash Bo'limi (ghaksa.khu.ac.kr)",
        "MN": "Академик дэмжлэгийн хэлтэс (ghaksa.khu.ac.kr)"
      },
      {
        "KO": "기숙사(dorm2.khu.ac.kr)",
        "EN": "Dormitory (dorm2.khu.ac.kr)",
        "ZH": "宿舍（dorm2.khu.ac.kr）",
        "VI": "Ký túc xá (dorm2.khu.ac.kr)",
        "UZ": "Yotoqxona (dorm2.khu.ac.kr)",
        "MN": "Дотуур байр (dorm2.khu.ac.kr)"
      },
      {
        "KO": "e-Campus",
        "EN": "e-Campus",
        "ZH": "e-Campus",
        "VI": "e-Campus",
        "UZ": "e-Kampus",
        "MN": "e-Campus"
      }
    ],
    "answer": 1,
    "explanation": {
      "KO": "학사지원과(ghaksa.khu.ac.kr)에서 휴학·복학·학적 변동 등을 처리합니다.",
      "EN": "The Academic Affairs Office (ghaksa.khu.ac.kr) handles leave of absence, returning to school, enrollment changes, and the like.",
      "ZH": "学务支援科（ghaksa.khu.ac.kr）负责办理休学、复学、学籍变动等。",
      "VI": "Phòng Hỗ trợ Học vụ (ghaksa.khu.ac.kr) xử lý nghỉ học, học lại, thay đổi học bạ, v.v.",
      "UZ": "Akademik Qo'llab-quvvatlash Bo'limi (ghaksa.khu.ac.kr) ta'til, tiklanish va akademik o'zgarishlarni boshqaradi.",
      "MN": "Академик дэмжлэгийн хэлтэс (ghaksa.khu.ac.kr) нь чөлөө, сэргээн томилогдох болон академик өөрчлөлтүүдийг хариуцдаг."
    }
  },
  {
    "id": 20,
    "category": "HUMANITIES",
    "question": {
      "KO": "2024학년도 입학생 기준 필수교과 이수학점은?",
      "EN": "How many required-course credits do 2024 entrants need?",
      "ZH": "以 2024 学年入学生为准，必修课程需修多少学分？",
      "VI": "Theo tân sinh viên khóa 2024, môn bắt buộc cần bao nhiêu tín chỉ?",
      "UZ": "2024-yilgi qabul uchun talab qilinadigan kurs kreditlari qanchalar?",
      "MN": "2024 оны элсэлтийн заавал ямар хичээлийн кредит шаардлагатай вэ?"
    },
    "options": [
      {
        "KO": "12학점",
        "EN": "12 credits",
        "ZH": "12 学分",
        "VI": "12 tín chỉ",
        "UZ": "12 ta kredit",
        "MN": "12 кредит"
      },
      {
        "KO": "15학점",
        "EN": "15 credits",
        "ZH": "15 学分",
        "VI": "15 tín chỉ",
        "UZ": "15 ta kredit",
        "MN": "15 кредит"
      },
      {
        "KO": "17학점",
        "EN": "17 credits",
        "ZH": "17 学分",
        "VI": "17 tín chỉ",
        "UZ": "17 ta kredit",
        "MN": "17 кредит"
      },
      {
        "KO": "20학점",
        "EN": "20 credits",
        "ZH": "20 学分",
        "VI": "20 tín chỉ",
        "UZ": "20 ta kredit",
        "MN": "20 кредит"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "필수교과: 인간의가치탐색(3)+세계와시민(3)+빅뱅에서문명까지(3)+성찰과표현(3)+주제연구(3)+대학영어(2) = 17학점.",
      "EN": "Required courses: Exploring Human Values (3) + The World and Citizens (3) + From the Big Bang to Civilization (3) + Reflection and Expression (3) + Thematic Research (3) + College English (2) = 17 credits.",
      "ZH": "必修课程：人类价值探索（3）+ 世界与市民（3）+ 从大爆炸到文明（3）+ 反思与表达（3）+ 主题研究（3）+ 大学英语（2）= 17 学分。",
      "VI": "Môn bắt buộc: Khám phá giá trị con người (3) + Thế giới và Công dân (3) + Từ Big Bang đến Văn minh (3) + Suy ngẫm và Biểu đạt (3) + Nghiên cứu chuyên đề (3) + Tiếng Anh đại học (2) = 17 tín chỉ.",
      "UZ": "Majburiy kurslar: Insoniy qadriyatlarni o'rganish (3) + Dunyo va fuqarolar (3) + Buyuk portlashdan sivilizatsiyagacha (3) + Fikrlash va ifoda (3) + Tematik tadqiqotlar (3) + Kollej ingliz tili (2) = 17 kredit.",
      "MN": "Заавал судлах хичээлүүд: Хүний үнэт зүйлсийг судлах (3) + Дэлхий ба иргэд (3) + Их тэсрэлтээс иргэншил хүртэл (3) + Эргэцүүлэлт ба илэрхийлэл (3) + Сэдэвчилсэн судалгаа (3) + Коллежийн англи хэл (2) = 17 кредит."
    }
  },
  {
    "id": 21,
    "category": "HUMANITIES",
    "question": {
      "KO": "'주제연구'를 수강하기 위한 선수과목은?",
      "EN": "What is the prerequisite course for taking 'Thematic Research'?",
      "ZH": "修读\"主题研究\"的先修课是？",
      "VI": "Môn tiên quyết để học 'Nghiên cứu chuyên đề' là gì?",
      "UZ": "'Tematik tadqiqot' kursini olish uchun zarur kurslar qaysilar?",
      "MN": "'Сэдэвчилсэн судалгаа' судлахад ямар хичээлүүд шаардлагатай вэ?"
    },
    "options": [
      {
        "KO": "세계와시민",
        "EN": "The World and Citizens",
        "ZH": "世界与市民",
        "VI": "Thế giới và Công dân",
        "UZ": "Dunyo va Fuqarolar",
        "MN": "Дэлхий ба иргэд"
      },
      {
        "KO": "인간의가치탐색",
        "EN": "Exploring Human Values",
        "ZH": "人类价值探索",
        "VI": "Khám phá giá trị con người",
        "UZ": "Insoniy qadriyatlarni o'rganish",
        "MN": "Хүний үнэт зүйлсийг судлах"
      },
      {
        "KO": "성찰과표현",
        "EN": "Reflection and Expression",
        "ZH": "反思与表达",
        "VI": "Suy ngẫm và Biểu đạt",
        "UZ": "Fikrlash va ifoda",
        "MN": "Тусгал ба илэрхийлэл"
      },
      {
        "KO": "대학영어",
        "EN": "College English",
        "ZH": "大学英语",
        "VI": "Tiếng Anh đại học",
        "UZ": "Kollej ingliz tili",
        "MN": "Коллежийн англи хэл"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "'성찰과표현'은 1학년 필수이자 '주제연구'의 선수과목입니다.",
      "EN": "'Reflection and Expression' is a 1st-year requirement and the prerequisite for 'Thematic Research.'",
      "ZH": "\"反思与表达\"既是一年级必修课，也是\"主题研究\"的先修课。",
      "VI": "'Suy ngẫm và Biểu đạt' là môn bắt buộc năm 1 và là môn tiên quyết của 'Nghiên cứu chuyên đề'.",
      "UZ": "'Reflection and Expression' — bu majburiy birinchi kurs kursi bo'lib, 'Tematik tadqiqot' uchun zarur shartdir.",
      "MN": "'Reflection and Expression' нь анхны курсын заавал суралцах хичээл бөгөөд 'Сэдэвчилсэн судалгаа'-д урьдчилсан шаардлага юм."
    }
  },
  {
    "id": 22,
    "category": "HUMANITIES",
    "question": {
      "KO": "배분이수교과는 5개 영역 중 최소 몇 개 영역에서 이수해야 하나요?",
      "EN": "For the distribution requirement, in at least how many of the 5 areas must you complete courses?",
      "ZH": "分配修读课程在 5 个领域中至少要修完几个领域？",
      "VI": "Với môn phân bổ, phải hoàn thành ở ít nhất bao nhiêu trong 5 lĩnh vực?",
      "UZ": "Beshta belgilangan kursdan kamida nechtasini ushbu beshta sohada tugatishim kerak?",
      "MN": "Эдгээр таван чиглэлээр заасан таван хичээлээс хэдийг нь дуусгах ёстой вэ?"
    },
    "options": [
      {
        "KO": "1개",
        "EN": "1 area",
        "ZH": "1 个",
        "VI": "1 lĩnh vực",
        "UZ": "1 ta element",
        "MN": "1 зүйл"
      },
      {
        "KO": "2개",
        "EN": "2 areas",
        "ZH": "2 个",
        "VI": "2 lĩnh vực",
        "UZ": "2",
        "MN": "2"
      },
      {
        "KO": "3개",
        "EN": "3 areas",
        "ZH": "3 个",
        "VI": "3 lĩnh vực",
        "UZ": "3",
        "MN": "3"
      },
      {
        "KO": "5개 전부",
        "EN": "All 5 areas",
        "ZH": "全部 5 个",
        "VI": "Cả 5 lĩnh vực",
        "UZ": "Hammasi 5",
        "MN": "Бүх 5"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "5개 영역 중 3개 이상 선택, 9학점 이상 이수해야 합니다.",
      "EN": "You must choose at least 3 of the 5 areas and complete at least 9 credits.",
      "ZH": "必须在 5 个领域中至少选 3 个，并修满 9 学分以上。",
      "VI": "Phải chọn ít nhất 3 trong 5 lĩnh vực và hoàn thành từ 9 tín chỉ trở lên.",
      "UZ": "Siz 5 sohadan kamida 3 tasini tanlashingiz va kamida 9 ta kreditni to'ldirishingiz kerak.",
      "MN": "Та 5 бүсээс дор хаяж 3-ыг сонгож, дор хаяж 9 кредит дүүргэх ёстой."
    }
  },
  {
    "id": 23,
    "category": "HUMANITIES",
    "question": {
      "KO": "국제캠퍼스 학생의 교양 최대 인정 학점은?",
      "EN": "What's the maximum general-education credits recognized for International Campus students?",
      "ZH": "国际校区学生通识课程的最高认可学分是多少？",
      "VI": "Tín chỉ đại cương tối đa được công nhận cho sinh viên Cơ sở Quốc tế là bao nhiêu?",
      "UZ": "Xalqaro kampusdagi talabalar uchun eng yuqori tan olingan umumiy ta'lim krediti qancha?",
      "MN": "Олон улсын кампус дээрх оюутнуудад хамгийн их хүлээн зөвшөөрөгдсөн ерөнхий боловсролын кредит хэд вэ?"
    },
    "options": [
      {
        "KO": "29학점",
        "EN": "29 credits",
        "ZH": "29 学分",
        "VI": "29 tín chỉ",
        "UZ": "29 ta kredit",
        "MN": "29 кредит"
      },
      {
        "KO": "40학점",
        "EN": "40 credits",
        "ZH": "40 学分",
        "VI": "40 tín chỉ",
        "UZ": "40 ta kredit",
        "MN": "40 кредит"
      },
      {
        "KO": "50학점",
        "EN": "50 credits",
        "ZH": "50 学分",
        "VI": "50 tín chỉ",
        "UZ": "50 ta kredit",
        "MN": "50 кредит"
      },
      {
        "KO": "56학점",
        "EN": "56 credits",
        "ZH": "56 学分",
        "VI": "56 tín chỉ",
        "UZ": "56 ta kredit",
        "MN": "56 кредит"
      }
    ],
    "answer": 2,
    "explanation": {
      "KO": "국제캠퍼스는 최대 50학점까지 교양으로 인정됩니다(서울캠퍼스는 56학점).",
      "EN": "The International Campus recognizes up to 50 general-education credits (Seoul Campus allows 56).",
      "ZH": "国际校区最多认可 50 个通识学分（首尔校区为 56 学分）。",
      "VI": "Cơ sở Quốc tế công nhận tối đa 50 tín chỉ đại cương (Cơ sở Seoul là 56 tín chỉ).",
      "UZ": "Xalqaro kampus 50 tagacha umumiy ta'lim kreditlarini qabul qiladi (Seul kampusida 56 kredit bor).",
      "MN": "Олон улсын кампус нь 50 хүртэлх ерөнхий боловсролын кредит хүлээн авах боломжтой (Сөүл кампус 56 кредиттэй)."
    }
  }
];
