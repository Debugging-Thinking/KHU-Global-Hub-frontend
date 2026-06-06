import type { BadgeId } from '../types/badge';
import type { Language } from '../types/board';

export type L10n = Record<Language, string>;

export interface GuideTip { icon: string; title: L10n; content: L10n; link?: string; }
export interface GuideCategory { id: BadgeId; title: L10n; emoji: string; color: string; tips: GuideTip[]; }

// ⚠️ 자동 생성 (scripts/translate-static.ts). KO/EN은 사람 작성, ZH/VI/UZ/MN은 Azure 번역(네이티브 검수 권장).
export const KHU_GUIDE: GuideCategory[] = [
  {
    "id": "COURSE_REG",
    "title": {
      "KO": "수강신청",
      "EN": "Course Registration",
      "ZH": "选课",
      "VI": "Đăng ký môn học",
      "UZ": "Kursga ro'yxatdan o'tish",
      "MN": "Курсийн бүртгэл"
    },
    "emoji": "📚",
    "color": "#C41230",
    "tips": [
      {
        "icon": "💻",
        "title": {
          "KO": "신입생은 PC로만 신청 가능",
          "EN": "Freshmen Can Only Register on a PC",
          "ZH": "新生只能用电脑选课",
          "VI": "Sinh viên năm nhất chỉ đăng ký được trên máy tính",
          "UZ": "Yangi talabalar faqat kompyuter orqali ariza topshirishlari mumkin.",
          "MN": "Шинэ оюутнууд зөвхөн PC-ээр өргөдөл гаргах боломжтой."
        },
        "content": {
          "KO": "수강신청은 모바일 앱 또는 PC 웹사이트 중 선택할 수 있습니다. 단, 신입생은 희망과목 담기/예비과목 담기를 사전에 진행하지 않았으므로 PC 웹사이트로만 수강신청이 가능합니다.",
          "EN": "You can register for courses using either the mobile app or the PC website. However, since freshmen haven't done the pre-registration wishlist (adding desired/backup courses in advance), they can only register through the PC website.",
          "ZH": "选课时可以选择使用手机 App 或 PC 网站。不过，新生事先没有进行心仪课程/备选课程的预选（加入愿望清单），所以只能通过 PC 网站选课。",
          "VI": "Bạn có thể đăng ký môn học bằng ứng dụng di động hoặc trang web trên máy tính. Tuy nhiên, vì sinh viên năm nhất chưa thực hiện bước thêm môn học mong muốn/môn dự phòng vào giỏ trước, nên chỉ có thể đăng ký qua trang web trên máy tính.",
          "UZ": "Siz kurslarga mobil ilova yoki kompyuter veb-sayti orqali ro'yxatdan o'tishni tanlashingiz mumkin. Biroq, yangi talabalar o'zlari xohlagan yoki tayyorlov kurslariga oldindan ro'yxatdan o'tmagan, shuning uchun ro'yxatdan o'tish faqat PC veb-sayti orqali amalga oshiriladi.",
          "MN": "Та гар утасны апп эсвэл PC-ийн вэбсайтаар хичээлд бүртгүүлэхээ сонгож болно. Гэсэн хэдий ч шинэ оюутнууд хүссэн эсвэл бэлтгэл хичээлдээ урьдчилан бүртгүүлээгүй тул бүртгүүлэх нь зөвхөн PC вэбсайтаар дамжуулан боломжтой."
        }
      },
      {
        "icon": "🏠",
        "title": {
          "KO": "장소 선택: 집 vs 피시방",
          "EN": "Where to Register: Home vs. PC Café",
          "ZH": "地点选择：家里 vs 网吧",
          "VI": "Chọn địa điểm: ở nhà hay quán net",
          "UZ": "Joy tanlovi: Uy va PC Bang",
          "MN": "Талбай сонголт: Home vs. PC Bang"
        },
        "content": {
          "KO": "컴퓨터 사양은 결과에 거의 영향 없습니다. 입장 타이밍과 손놀림이 결과의 95%를 결정합니다.\n\n• 집 컴퓨터: 심각하게 노후화된 기기가 아니라면 충분\n• 피시방: 1시간 전 도착 권장. 30분 전은 촉박할 수 있음\n\n실제로 학교 근로 컴퓨터에서 올클한 사례도 많고, 고사양 PC방에서 전패한 사례도 많습니다.",
          "EN": "Your computer's specs barely affect the outcome. Your entry timing and how fast your hands move decide 95% of the result.\n\n• Home PC: fine unless it's seriously outdated\n• PC café: arrive 1 hour early — 30 minutes can be cutting it close\n\nIn reality, plenty of people have gotten every course they wanted on a campus work-study computer, while others have struck out completely on a high-end gaming PC.",
          "ZH": "电脑配置几乎不影响结果。进入的时机和手速决定了 95% 的成败。\n\n• 家用电脑：只要不是严重老化的机器就够用\n• 网吧：建议提前 1 小时到。提前 30 分钟可能太赶\n\n实际上，很多人用学校勤工俭学的电脑就抢到了全部想要的课，也有很多人在高配网吧里全军覆没。",
          "VI": "Cấu hình máy tính hầu như không ảnh hưởng đến kết quả. Thời điểm vào và tốc độ thao tác quyết định 95% kết quả.\n\n• Máy tính ở nhà: chỉ cần không phải máy quá cũ kỹ là đủ\n• Quán net: nên đến trước 1 tiếng. Trước 30 phút có thể hơi sát giờ\n\nThực tế, rất nhiều người đăng ký được hết môn ngay trên máy tính làm thêm ở trường, và cũng có nhiều người thua trắng dù dùng máy net cấu hình cao.",
          "UZ": "Kompyuter texnik xususiyatlari natijalarga deyarli ta'sir qilmaydi. Kirish vaqti va qo'l harakatlari natijaning 95% ini belgilaydi.\n\n• Uy kompyuteri: yetarli, agar qurilma jiddiy eskirmagan bo'lsa\n• PC bang: 1 soat oldin yetib kelish tavsiya etiladi. 30 daqiqa oldin qisqa bo'lishi mumkin\n\nAslida, ko'plab odamlar maktab ish kompyuterida toza dars olgan va yuqori darajadagi kompyuter portlashlarida yutqazish holatlari ham bo'lgan.",
          "MN": "Компьютерийн үзүүлэлтүүд үр дүнд бага нөлөө үзүүлдэг. Орох цаг болон гарын хөдөлгөөн үр дүнгийн 95%-ийг тодорхойлдог.\n\n• Гэрийн компьютер: төхөөрөмж маш хуучирсан биш байвал хангалттай\n• PC bang: 1 цагийн өмнө ирэхийг зөвлөж байна. 30 минутын өмнө хэцүү байж магадгүй\n\nҮнэндээ олон тохиолдол нь сургуулийн ажлын компьютер дээр бүрэн цэвэр анги авсан бөгөөд өндөр үзүүлэлттэй PC-д ялагдах тохиолдол ч бий."
        }
      },
      {
        "icon": "🖥️",
        "title": {
          "KO": "3창 구성 + 메모장 준비",
          "EN": "Set Up 3 Windows + a Notepad",
          "ZH": "准备 3 个窗口 + 记事本",
          "VI": "Mở sẵn 3 cửa sổ + Notepad",
          "UZ": "3-oynali sozlama + daftar tayyorlash",
          "MN": "3 цонхны тохиргоо + тэмдэглэл бэлтгэл"
        },
        "content": {
          "KO": "3개 창을 준비하세요:\n① 네이비즘 서버시간 (네이버 검색 → 네이비즘, 밀리초 ON / 날짜 OFF)\n② 메모장 — 학수번호 목록 (하이픈 제거, 경쟁 치열한 수업 위쪽, 대안 코드 준비)\n③ 수강신청 사이트\n\n⚠️ 네이버 시계 등 다른 시간 도구는 사용하지 마세요.\n💡 교양 수업은 강의평가가 좋은 교수를 반드시 선택하세요. 교수에 따른 편차가 매우 큽니다.",
          "EN": "Get 3 windows ready:\n① Navyism server time (search \"Navyism\" on Naver, milliseconds ON / date OFF)\n② Notepad — your list of course codes (strip the hyphens, put the most competitive classes on top, prepare backup codes)\n③ The course registration site\n\n⚠️ Don't use other time tools like the Naver clock.\n💡 For general-education electives, always pick professors with good lecture reviews. The difference between professors is huge.",
          "ZH": "请准备 3 个窗口：\n① Navyism 服务器时间（在 Naver 搜索 → Navyism，毫秒开启 / 日期关闭）\n② 记事本 —— 学时号清单（去掉连字符，竞争激烈的课放最上面，备好替代课号）\n③ 选课网站\n\n⚠️ 不要使用 Naver 时钟等其他时间工具。\n💡 通识课一定要选课程评价好的教授。不同教授之间的差异非常大。",
          "VI": "Hãy chuẩn bị 3 cửa sổ:\n① Giờ máy chủ Navyism (tìm \"Navyism\" trên Naver, bật mili giây / tắt ngày)\n② Notepad — danh sách mã môn học (bỏ dấu gạch nối, đặt môn cạnh tranh cao lên trên, chuẩn bị mã dự phòng)\n③ Trang web đăng ký môn học\n\n⚠️ Đừng dùng các công cụ xem giờ khác như đồng hồ Naver.\n💡 Với môn đại cương, nhất định phải chọn giáo sư có đánh giá giảng dạy tốt. Chênh lệch giữa các giáo sư rất lớn.",
          "UZ": "3 ta oynani tayyorlang:\n(1) Navizm server vaqti (Naver → Navizm ni qidiring, millisekundlar YOQILGAN / SANA O'chirilgan)\n(2) Notepad — Kurs raqamlari ro'yxati (tirelarni olib tashlash, yuqori raqobatbardosh darslar boshi, muqobil kodlar tayyorlash)\n(3) Kurs ro'yxatdan o'tish joyi\n\n⚠️ Naver Clock kabi boshqa vaqt vositalaridan foydalanmang.\n💡 Liberal san'at darslari uchun, yaxshi kurs baholashiga ega professorlarni tanlashni unutmang. Professorga qarab sezilarli farqlar mavjud.",
          "MN": "3 цонх бэлд:\n(1) Navizm серверийн хугацаа (хайлт Naver → Navizm, миллисекунд АСААЛТ / ОГНОО УНТРААЛТ)\n(2) Тэмдэглэл — Хичээлийн дугаарын жагсаалт (зураас хасах, өрсөлдөөнтэй хичээлүүдийн дээд хэсэг, өөр код бэлтгэх)\n(3) Хичээлийн бүртгэлийн сайт\n\n⚠️ Naver Clock зэрэг бусад цагийн хэрэгслүүдийг битгий ашигла.\n💡 Либерал урлагийн хичээлүүдэд сайн үнэлгээтэй профессоруудыг сонгоорой. Профессороос хамааран ихээхэн ялгаа байдаг."
        }
      },
      {
        "icon": "⚙️",
        "title": {
          "KO": "PC 환경 설정 체크리스트",
          "EN": "PC Setup Checklist",
          "ZH": "电脑环境设置清单",
          "VI": "Danh sách kiểm tra cài đặt máy tính",
          "UZ": "PC Preferences Ro'yxati",
          "MN": "PC-ийн тохиргоо шалгах жагсаалт"
        },
        "content": {
          "KO": "수강신청 전 완료해야 할 설정:\n• 크롬: 마우스 우클릭 → 관리자 권한으로 실행\n• 팝업: 크롬 설정 → 팝업 및 리디렉션 → 허용\n• 백그라운드 앱 모두 OFF\n• 백신 프로그램 일시 중지\n• 네이비즘: 날짜 OFF, 밀리초 ON\n• 서버시간 일치 여부 반드시 확인\n• 비활성 10분 시 자동 로그아웃 → 주기적으로 페이지 갱신\n• F5 절대 금지\n\n💡 0.001초 차이가 수백~수천 명 순위 차이로 이어질 수 있습니다.",
          "EN": "Settings to finish before registration:\n• Chrome: right-click → run as administrator\n• Popups: Chrome settings → Popups and redirects → Allow\n• Close all background apps\n• Pause your antivirus software\n• Navyism: date OFF, milliseconds ON\n• Always confirm the server time matches\n• Auto-logout after 10 minutes of inactivity → refresh the page periodically\n• Never press F5\n\n💡 A 0.001-second difference can mean a gap of hundreds to thousands of places in line.",
          "ZH": "选课前要完成的设置：\n• Chrome：鼠标右键 → 以管理员身份运行\n• 弹窗：Chrome 设置 → 弹出式窗口和重定向 → 允许\n• 关闭所有后台应用\n• 暂停杀毒软件\n• Navyism：日期关闭，毫秒开启\n• 务必确认服务器时间是否一致\n• 闲置 10 分钟会自动登出 → 定期刷新页面\n• 绝对不要按 F5\n\n💡 0.001 秒的差距，可能造成数百至数千名的排名差异。",
          "VI": "Những cài đặt cần hoàn tất trước khi đăng ký:\n• Chrome: nhấp chuột phải → chạy với quyền quản trị viên\n• Cửa sổ bật lên: Cài đặt Chrome → Cửa sổ bật lên và chuyển hướng → Cho phép\n• Tắt hết các ứng dụng chạy nền\n• Tạm dừng phần mềm diệt virus\n• Navyism: tắt ngày, bật mili giây\n• Nhất định kiểm tra xem giờ máy chủ có khớp không\n• Tự đăng xuất sau 10 phút không hoạt động → làm mới trang định kỳ\n• Tuyệt đối không nhấn F5\n\n💡 Chênh lệch 0,001 giây có thể tạo ra khoảng cách hàng trăm đến hàng nghìn thứ hạng.",
          "UZ": "Ro'yxatdan o'tishdan oldin bajarilishi kerak bo'lgan sozlamalar:\n• Chrome: O'ng tugma → administrator sifatida ishga tushiriladi\n• Pop-uplar: Chrome sozlamalari → → pop-uplar va yo'nalishni o'zgartirishga ruxsat beriladi\n• Barcha fon ilovalari O'CHIRILGAN\n• Vaksina dasturlarini to'xtatish\n• Dengiz floti: Sana O'CHIRILGAN, milisekundlar YOQILGAN\n• Har doim server vaqti mos keladimi, tekshiring\n• 10 daqiqalik faoliyatsizlikdan so'ng avtomatik chiqish→ Sahifa vaqti-vaqti bilan yangilanadi\n• F5 mutlaqo taqiqlangan\n\n💡 0.001 soniyalik farq yuzlar~minglab odamlarning reytingiga olib kelishi mumkin.",
          "MN": "Бүртгүүлэхээс өмнө гүйцэтгэх тохиргоо:\n• Chrome: Администраторын хувиар ажиллуулахын тулд баруун товчийг дарна →\n• Popups: Pop-up болон чиглэл → → Chrome-ийн тохиргоог ашиглах боломжтой\n• Бүх арын програмууд УНТРААГДСАН\n• Вакцины хөтөлбөрүүдийг зогсоох\n• Тэнгисийн цэрэг: Огноо OFF, Миллисекунд ON\n• Серверийн цаг таарч байгаа эсэхийг үргэлж шалгана\n• 10 минут идэвхгүй болсны дараа автоматаар гарах→ Үе үе хуудсыг шинэчлэх\n• F5 бүрэн хориглосон\n\n💡 0.001 секундийн зөрүү нь зуун~мянган хүний эрэмбэ үүсгэх боломжтой."
        }
      },
      {
        "icon": "🎯",
        "title": {
          "KO": "당일 진행 순서",
          "EN": "Step-by-Step on the Day",
          "ZH": "当天操作顺序",
          "VI": "Trình tự thao tác trong ngày",
          "UZ": "Kun tartibi",
          "MN": "Өдрийн дараалал"
        },
        "content": {
          "KO": "당황하지 않는 것이 가장 중요합니다. 침착하게:\n\n① 메모장 최상단 학수번호 미리 복사\n② 수강신청 사이트 입장\n③ 학수번호 검색창(상단 우측)에 붙여넣기\n④ 수강신청 버튼 클릭 (화면 왼쪽)\n⑤ 확인창 뜨면 ESC 키로 닫기\n⑥ 다음 학수번호 복사 후 반복\n\n⚠️ ESC 연타 주의 — 매크로 방지 팝업 활성화 가능\n⚠️ ESC 약 1,000회 연타 시 수강신청 내역 전체 초기화!",
          "EN": "The most important thing is not to panic. Stay calm:\n\n① Copy the top course code from your notepad in advance\n② Enter the registration site\n③ Paste the code into the search box (top right)\n④ Click the register button (left side of the screen)\n⑤ When the confirmation popup appears, close it with the ESC key\n⑥ Copy the next course code and repeat\n\n⚠️ Be careful about mashing ESC — it can trigger an anti-macro popup\n⚠️ Hitting ESC about 1,000 times resets your entire registration!",
          "ZH": "最重要的是不要慌。保持冷静：\n\n① 提前复制好记事本最上面的学时号\n② 进入选课网站\n③ 把学时号粘贴到搜索框（右上角）\n④ 点击选课按钮（屏幕左侧）\n⑤ 弹出确认窗时，用 ESC 键关闭\n⑥ 复制下一个学时号，重复操作\n\n⚠️ 小心连按 ESC —— 可能触发防宏弹窗\n⚠️ 连按 ESC 约 1,000 次，会把整个选课记录全部清空！",
          "VI": "Quan trọng nhất là đừng hoảng. Hãy bình tĩnh:\n\n① Sao chép sẵn mã môn học ở dòng trên cùng của Notepad\n② Vào trang web đăng ký môn học\n③ Dán mã môn vào ô tìm kiếm (góc trên bên phải)\n④ Nhấn nút đăng ký (bên trái màn hình)\n⑤ Khi cửa sổ xác nhận hiện ra, đóng nó bằng phím ESC\n⑥ Sao chép mã môn tiếp theo rồi lặp lại\n\n⚠️ Cẩn thận khi nhấn ESC liên tục — có thể kích hoạt cửa sổ chống macro\n⚠️ Nhấn ESC khoảng 1.000 lần sẽ xóa sạch toàn bộ kết quả đăng ký!",
          "UZ": "Eng muhim narsa vahimaga tushmaslik. Xotirjamlik bilan:\n\n(1) Daftarning yuqori qismidagi kurs raqamini oldindan ko'chiring\n(2) Kurs ro'yxatdan o'tish joyiga kirish\n(3) Raqamni qidiruv oynasiga (yuqori o'ngda) joylashtiring\n(4) Kursga ro'yxatdan o'tish tugmasini (ekranning chap tomoni) bosing.\n(5) Tasdiqlash oynasi paydo bo'lganda, uni ESC kaliti bilan yoping.\n(6) Quyidagi kurs raqamini ko'chirib, takrorlang\n\n⚠️ ESC Rapid Strike ehtiyot bo'ling — Makro oldini olish popupi yoqilgan\n⚠️ ESCni taxminan 1,000 marta bosganingizda, barcha kurs ro'yxatdan o'tish ma'lumotlari yangilanadi!",
          "MN": "Сандрах нь хамгийн чухал зүйл. Тайван:\n\n(1) Тэмдэглэлийн дэвтэрний дээд хэсэгт хичээлийн дугаарыг урьдчилан хуулбарлах\n(2) Курсийн бүртгэлийн сайт руу нэвтрэх боломж\n(3) Дугаарыг хайлтын хайрцагт (баруун дээд хэсэгт) наав\n(4) Замын бүртгэлийн товчийг дарна (дэлгэцийн зүүн талд)\n(5) Баталгаажуулах цонх гарч ирэхэд ESC түлхүүрээр хаа.\n(6) Дараах курсын дугаарыг хуулбарлаж, давтах\n\n⚠️ ESC Rapid Strike Beware — Макро урьдчилан сэргийлэх попап идэвхжсэн\n⚠️ ESC-г ойролцоогоор 1,000 удаа дарвал бүх замын бүртгэлийн мэдээлэл дахин тохируулна!"
        }
      },
      {
        "icon": "✅",
        "title": {
          "KO": "올클 성공 후 대처",
          "EN": "After a Clean Sweep",
          "ZH": "全部抢到之后怎么办",
          "VI": "Khi đã đăng ký được hết môn",
          "UZ": "Muvaffaqiyatli tozalikdan keyingi javob",
          "MN": "Амжилттай бүх зүйл цэвэр болсон дараах хариу үйлдэл"
        },
        "content": {
          "KO": "• 강의평가가 모두 양호하면 그대로 종료\n• 평이한 교수가 있다면 잔여 인원 변동을 주시하며 더 좋은 강의로 교체 시도\n\n💡 비대면 수업은 \"분반\" 제도로 관리자가 시간차로 티오를 추가 공개합니다. 놓쳤더라도 포기하지 말고 계속 확인하세요. 갑자기 10분 후 10명이 풀리는 경우도 있습니다.",
          "EN": "• If all the lecture reviews look good, just call it done\n• If one of your professors seems only so-so, keep an eye on the remaining seat count and try to swap in a better class\n\n💡 Online classes are managed with a \"section split\" system, where admins release extra openings at staggered times. Even if you missed out, don't give up — keep checking. Sometimes 10 seats suddenly open up 10 minutes later.",
          "ZH": "• 如果所有课的评价都不错，就这样结束\n• 如果某位教授评价一般，就盯着剩余名额的变化，试着换成更好的课\n\n💡 线上课用的是\"分班\"制度，管理员会错峰陆续放出名额。即使错过了也别放弃，继续刷。有时候 10 分钟后会突然放出 10 个名额。",
          "VI": "• Nếu đánh giá giảng dạy của tất cả các môn đều ổn thì cứ kết thúc như vậy\n• Nếu có giáo sư nào đó chỉ ở mức bình thường, hãy theo dõi biến động số chỗ còn lại và thử đổi sang lớp tốt hơn\n\n💡 Lớp học trực tuyến được quản lý theo chế độ \"chia lớp\", quản trị viên sẽ mở thêm chỗ trống vào các thời điểm khác nhau. Dù bạn có lỡ thì cũng đừng bỏ cuộc — cứ kiểm tra liên tục. Có khi 10 phút sau đột nhiên mở ra 10 chỗ.",
          "UZ": "• Agar barcha kurs baholari qoniqarli bo'lsa, dastur o'z holicha yakunlanadi.\n• Agar o'rtacha professorlar bo'lsa, qolgan xodimlar tarkibidagi o'zgarishlarni kuzating va ularni yaxshiroq kurslar bilan almashtirishga harakat qiling\n\n💡 Onlayn darslar \"split\" tizimidan foydalanadi, bunda administratorlar turli vaqtlarda qo'shimcha Tio ni ko'rsatadi. Agar o'tkazib yuborgan bo'lsangiz ham, taslim bo'lmang va tekshirishni davom ettiring. Ba'zan 10 daqiqadan so'ng o'n kishi ozod qilinadi.",
          "MN": "• Хэрэв бүх курсын үнэлгээ сэтгэл ханамжтай байвал хөтөлбөр одоогоор дуусдаг.\n• Хэрвээ багш нар дунд зэрэг байвал үлдсэн ажилтнуудын өөрчлөлтийг хянаж, илүү сайн хичээлүүдээр орлуулахыг хичээ\n\n💡 Онлайн хичээлүүд \"хуваагдсан\" системийг ашигладаг бөгөөд удирдлага нь өөр өөр цагт нэмэлт Tio-г илчилдэг. Чи алдаж байсан ч, битгий бууж өгч, үргэлжлүүлээд шалгаарай. Заримдаа арван хүн 10 минутын дараа суллагдсан."
        }
      },
      {
        "icon": "❌",
        "title": {
          "KO": "올클 실패 후 대처",
          "EN": "If You Missed Some Courses",
          "ZH": "没抢全时怎么办",
          "VI": "Khi không đăng ký đủ môn",
          "UZ": "To'liq sinfni o'ta olmagandan keyingi javob",
          "MN": "Бүх ангилалд амжилт гаргаж чадаагүйгээс хойш хариу үйлдэл үзүүлсэн"
        },
        "content": {
          "KO": "① 대안 수업 코드로 침착하게 신청 시도\n② 1학년 수업 티오는 비교적 넉넉 — 시간표 구성 자체가 불가능한 경우는 드뭄\n③ 최소 12시까지는 사이트 유지하며 잔여 티오 확인\n\n💡 취소지연제: 11시 30분경부터 적용. 다른 학생이 취소해도 일정 시간 후 신청 가능 — 소수 자리 확보 기회.\n💡 1학년 필수 과목은 대부분 계절학기에도 개설됩니다.",
          "EN": "① Calmly try registering with your backup course codes\n② Freshman classes have relatively plenty of seats — it's rare for a workable timetable to be impossible\n③ Keep the site open until at least noon and keep checking for remaining openings\n\n💡 Cancellation-delay system: kicks in around 11:30. Even when another student drops a course, the seat only becomes available after a set delay — a chance to grab one of the few open spots.\n💡 Most required freshman courses are also offered in the seasonal (winter/summer) sessions.",
          "ZH": "① 用备选课号冷静地尝试申请\n② 一年级课程名额相对充裕 —— 完全排不出课表的情况很少见\n③ 至少把网站开到中午 12 点，持续查看剩余名额\n\n💡 取消延迟制：大约从 11:30 开始生效。即使其他学生退课，也要等一段时间后才能申请 —— 这是抢到少量空位的机会。\n💡 大部分一年级必修课在季节学期也会开设。",
          "VI": "① Bình tĩnh thử đăng ký bằng các mã môn dự phòng\n② Lớp học năm nhất có khá nhiều chỗ — rất hiếm khi không thể xếp nổi thời khóa biểu\n③ Giữ trang web mở ít nhất đến 12 giờ trưa và liên tục kiểm tra chỗ còn lại\n\n💡 Chế độ hoãn hủy: bắt đầu áp dụng từ khoảng 11:30. Dù sinh viên khác có hủy môn, bạn cũng phải đợi một khoảng thời gian mới đăng ký được — đây là cơ hội giành lấy vài chỗ ít ỏi.\n💡 Hầu hết các môn bắt buộc của năm nhất cũng được mở trong học kỳ hè/đông.",
          "UZ": "(1) Tinchlik bilan muqobil klass kodi bilan ariza topshirib ko'ring\n(2) Birinchi kurs darslari nisbatan saxiy — jadval imkonsiz bo'lishi kam hol\n(3) Saytni kamida soat 12:00 gacha saqlang va qolgan T2 ni tekshiring\n\n💡 Bekor qilish kechikish siyosati: Taxminan soat 11:30 dan boshlab qo'llaniladi. Agar boshqa talaba bekor qilsa ham, ma'lum muddatdan keyin ham ariza topshirishingiz mumkin — bu bir nechta o'rinlarni qo'lga kiritish imkoniyati.\n💡 Ko'pgina birinchi kurs majburiy kurslari mavsumiy semestrda ham taklif etiladi.",
          "MN": "(1) Тайван байдлаар өөр ангиллын кодоор өргөдөл гаргахыг оролдоно\n(2) Нэгдүгээр курсийн ангиуд харьцангуй өгөөмөр — цагийн хуваарь ховор байдаг.\n(3) Сайтыг дор хаяж 12:00 цаг хүртэл байлгаж, үлдсэн T2-г шалгах\n\n💡 Цуцлах саатлын бодлого: Ойролцоогоор 11:30-аас хэрэгжсэн. Өөр нэг оюутан татгалзсан ч тодорхой хугацааны дараа өргөдөл гаргах боломжтой — энэ нь хэд хэдэн байр авах боломжтой.\n💡 Ихэнх анхны курсын заавал судлах хичээлүүд улирлын улиралд мөн санал болдог."
        }
      },
      {
        "icon": "📅",
        "title": {
          "KO": "정정 기간 (3/4 ~ 3/8)",
          "EN": "Add/Drop Period (Mar 4–8)",
          "ZH": "改选期（3/4 ～ 3/8）",
          "VI": "Thời gian điều chỉnh (4/3 ～ 8/3)",
          "UZ": "Tuzatish davri (3/4 ~ 3/8)",
          "MN": "Засварын үе (3/4 ~ 3/8)"
        },
        "content": {
          "KO": "3월 4일 10:30 ~ 3월 8일(금): 신청 못한 과목 추가 또는 수강 취소 가능.\n\n• 본전공 (2학년 이상): 교수 재량으로 강입 가능 ✅\n• 전공기초: 사실상 불가 — 빈 자리 직접 확인 ❌\n• 교양: 사실상 불가 — 빈 자리 직접 확인 ❌\n\n⚠️ 전공기초 미이수 시 성적우수장학금 지급 제한 가능!\n💡 인기 강의(별점 4.0↑)는 정정 기간에도 빈 자리 거의 없습니다.",
          "EN": "Mar 4, 10:30 ~ Mar 8 (Fri): you can add courses you missed or drop courses.\n\n• Major courses (2nd year and up): professor can let you in at their discretion ✅\n• Major foundation courses: practically impossible — check open seats yourself ❌\n• Electives: practically impossible — check open seats yourself ❌\n\n⚠️ Not completing your major foundation courses can limit your eligibility for the academic merit scholarship!\n💡 Popular classes (4.0+ stars) almost never have open seats even during the add/drop period.",
          "ZH": "3 月 4 日 10:30 ～ 3 月 8 日（周五）：可以补选没抢到的课，或退选课程。\n\n• 本专业课（二年级及以上）：教授可酌情让你加入 ✅\n• 专业基础课：基本不可能 —— 自己查空位 ❌\n• 通识课：基本不可能 —— 自己查空位 ❌\n\n⚠️ 没修完专业基础课，可能会影响成绩优秀奖学金的发放！\n💡 热门课程（评分 4.0 以上）即使在改选期也几乎没有空位。",
          "VI": "Ngày 4/3 lúc 10:30 ～ ngày 8/3 (Thứ Sáu): có thể bổ sung môn chưa đăng ký được hoặc hủy môn.\n\n• Môn chuyên ngành chính (năm 2 trở lên): giáo sư có thể cho vào lớp tùy quyết định ✅\n• Môn cơ sở ngành: gần như không thể — tự kiểm tra chỗ trống ❌\n• Môn đại cương: gần như không thể — tự kiểm tra chỗ trống ❌\n\n⚠️ Nếu không hoàn thành môn cơ sở ngành, học bổng khuyến khích học tập có thể bị hạn chế!\n💡 Các lớp được ưa chuộng (đánh giá từ 4.0 sao trở lên) hầu như không còn chỗ trống ngay cả trong thời gian điều chỉnh.",
          "UZ": "4-mart, 10:30 ~ 8-mart (Juma): Ro'yxatdan o'tmagan kurslar uchun kursni qo'shish yoki bekor qilish mumkin.\n\n• Asosiy yo'nalish (2-kurs va undan yuqori): Professorlar o'z xohishlariga ko'ra ro'yxatdan o'tishlari ✅ mumkin\n• Asosiy asoslar: Deyarli imkonsiz — Ochiq joylarni to'g'ridan-to'g'ri tekshirib ❌ ko'ring\n• Erkin san'atlar: Deyarli imkonsiz — Bo'sh o'rinlarni to'g'ridan-to'g'ri tekshirish ❌\n\n⚠️ Agar siz asosiy fondni tugatmasangiz, akademik mukammallik stipendiyalari cheklanishi mumkin!\n💡 Mashhur maydonlar (reytingi 4.0 dan yuqori) hatto tuzatish davrida ham deyarli hech qachon ochiq bo'lmaydi.",
          "MN": "Гуравдугаар сарын 4, 10:30 AM ~ Гуравдугаар сарын 8 (Баасан гараг): Бүртгүүлээгүй хичээлүүдийг нэмэх эсвэл цуцлах боломжтой.\n\n• Мэргэжил (2-р жил ба түүнээс дээш): Профессорууд өөрсдийн хүсэлтээр элсэж болно ✅\n• Үндсэн мэргэжил: Бараг боломжгүй — Нээлттэй байруудыг шууд шалгах ❌\n• Чөлөөт ухаан: Бараг боломжгүй — сул орон тоог шууд шалгах ❌\n\n⚠️ Хэрэв та мэргэжлийн суурь төгсөөгүй бол академик амжилтын тэтгэлэг хязгаарлагдаж магадгүй!\n💡 Алдартай талбайнууд (үнэлгээ 4.0-оос дээш) засварын үед ч бараг хэзээ ч нээгддэггүй."
        }
      },
      {
        "icon": "💾",
        "title": {
          "KO": "학점세이브제",
          "EN": "Credit Save System",
          "ZH": "学分储蓄制",
          "VI": "Chế độ lưu tín chỉ",
          "UZ": "Kredit saqlash tizimi",
          "MN": "Кредит хадгалах систем"
        },
        "content": {
          "KO": "부득이하게 수강학점이 부족할 경우 활용할 수 있는 최후의 수단:\n• 이번 학기 이수학점이 기준보다 적을 경우, 다음 학기에 최대 21학점(3학점 추가) 신청 가능\n• 조건: F 학점 없음, 최대 3학점까지 세이브 가능\n\n자세한 조건은 학교 정보게시판을 참고하세요.",
          "EN": "A last resort you can use if you're unavoidably short on credits:\n• If the credits you earn this semester fall below the standard, you can register for up to 21 credits (3 extra) next semester\n• Conditions: no F grades, and you can save up to 3 credits\n\nCheck the school's information board for the detailed conditions.",
          "ZH": "万不得已学分不够时可以动用的最后手段：\n• 如果本学期修得的学分低于标准，下学期最多可申请 21 学分（多加 3 学分）\n• 条件：没有 F 等级，最多可储蓄 3 学分\n\n详细条件请参考学校信息公告栏。",
          "VI": "Phương án cuối cùng bạn có thể dùng khi bất đắc dĩ bị thiếu tín chỉ:\n• Nếu số tín chỉ đạt được trong học kỳ này thấp hơn tiêu chuẩn, học kỳ sau bạn có thể đăng ký tối đa 21 tín chỉ (thêm 3 tín chỉ)\n• Điều kiện: không có điểm F, được lưu tối đa 3 tín chỉ\n\nĐiều kiện chi tiết vui lòng xem tại bảng thông tin của trường.",
          "UZ": "Agar kredit yetishmasa, oxirgi imkoniyat:\n• Agar ushbu semestrda bajarilgan kreditlar soni standartdan kam bo'lsa, keyingi semestrda 21 kreditgacha (qo'shimcha 3 kredit) uchun ariza topshirishingiz mumkin.\n• Shart: F baholari yo'q, 3 kreditgacha tejash mumkin\n\nBatafsil holatlar uchun maktab axborot taxtasiga murojaat qiling.",
          "MN": "Кредитгүй бол сүүлчийн арга хэмжээ:\n• Хэрэв энэ улиралд дууссан кредитийн тоо стандартаас бага байвал дараагийн улиралд 21 кредит (нэмэлт 3 кредит) авах хүсэлт гаргаж болно.\n• Нөхцөл: F үнэлгээ байхгүй, 3 кредит хүртэл хэмнэж болно\n\nДэлгэрэнгүй нөхцөл байдлыг сургуулийн мэдээллийн зөвлөлөөс үзнэ үү."
        }
      }
    ]
  },
  {
    "id": "TRANSPORT",
    "title": {
      "KO": "교통수단",
      "EN": "Transportation",
      "ZH": "交通",
      "VI": "Phương tiện di chuyển",
      "UZ": "Transport",
      "MN": "Тээвэр"
    },
    "emoji": "🚌",
    "color": "#1A6B3C",
    "tips": [
      {
        "icon": "🆓",
        "title": {
          "KO": "교내 구간 무료 탑승",
          "EN": "Free Rides Within Campus",
          "ZH": "校内路段免费乘车",
          "VI": "Đi xe miễn phí trong khuôn viên",
          "UZ": "Kampusda bepul sayohat bo'limlari",
          "MN": "Кампусын хэсгүүдэд үнэгүй аялал"
        },
        "content": {
          "KO": "아래 버스들은 교내 구간을 무료로 이용할 수 있습니다:\n9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• 교내 → 외부: 정건(경희대학교 정류장)까지 무료\n• 외부 → 교내: 정문(경희대정문 정류장)부터 무료\n• 방법: 카드를 찍지 않으면 됩니다\n\n💡 기사님께 탑승 시 \"감사합니다~\" 인사는 꼭 해주세요!\n⚠️ 정문 이전 탑승 또는 정건 이후 이동 시 요금 부과.",
          "EN": "The following buses are free within campus:\n9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• Campus → outside: free up to Jeonggeon (Kyung Hee University stop)\n• Outside → campus: free from the Front Gate (KHU Front Gate stop)\n• How: just don't tap your card\n\n💡 Be sure to say \"Thank you~\" to the driver when you board!\n⚠️ A fare is charged if you board before the Front Gate or travel past Jeonggeon.",
          "ZH": "以下公交车在校内路段可以免费乘坐：\n9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• 校内 → 校外：到正建（庆熙大学站）为止免费\n• 校外 → 校内：从正门（庆熙大学正门站）开始免费\n• 方法：不刷卡即可\n\n💡 上车时一定要对司机说一声\"谢谢～\"！\n⚠️ 在正门之前上车，或越过正建继续乘坐时，会收取车费。",
          "VI": "Các tuyến xe buýt sau được đi miễn phí trong đoạn nội khu:\n9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• Trong khuôn viên → ra ngoài: miễn phí đến trạm Jeonggeon (trạm Đại học Kyung Hee)\n• Ngoài → vào khuôn viên: miễn phí từ Cổng chính (trạm Cổng chính ĐH Kyung Hee)\n• Cách làm: chỉ cần không quẹt thẻ\n\n💡 Khi lên xe nhớ chào tài xế một câu \"Cảm ơn ạ~\"!\n⚠️ Nếu lên xe trước Cổng chính hoặc đi quá trạm Jeonggeon thì sẽ bị tính tiền vé.",
          "UZ": "Quyidagi avtobuslar kampus bo'limlarida bepul foydalanish mumkin:\n9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• Kampus ichida va tashqarisidagi → bepul kirish: Jeonggeon (Kyung Hee Universiteti avtobus bekati)\n• Kampusdagi tashqi →: Asosiy darvozadan (Kyung Hee Universiteti Asosiy darvozasi bekati) bepul\n• Usul: Faqat karta kerak\n\n💡 Iltimos, haydovchiga chiqishda \"Rahmat~\" deb aytishni unutmang!\n⚠️ Asosiy darvozadan oldin chiqish yoki asosiy darvozadan keyin harakat qilish uchun chipta olinadi.",
          "MN": "Дараах автобусуудыг кампусын хэсгүүдэд үнэгүй ашиглах боломжтой:\n9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• Кампус → дотор болон гаднах Жонгён (Кён Хи Их Сургуулийн автобусны буудал) руу үнэгүй орох боломжтой\n• Кампусын гадна →: Гол хаалганаас чөлөөтэй (Кён Хи их сургуулийн гол хаалганы буудал)\n• Арга: Зүгээр л карт тоглох хэрэгтэй\n\n💡 Суух үед жолоочид \"Баярлалаа~\" гэж заавал хэлээрэй!\n⚠️ Гол хаалганы өмнө суух эсвэл гол хаалганы дараа хөдөлхөд тасалбар төлдөг."
        }
      },
      {
        "icon": "🏙️",
        "title": {
          "KO": "서울 직행 빨간 버스",
          "EN": "Red Express Buses to Seoul",
          "ZH": "直达首尔的红色巴士",
          "VI": "Xe buýt đỏ đi thẳng Seoul",
          "UZ": "Seul Direct Red Bus",
          "MN": "Сөүл Директ Улаан Автобус"
        },
        "content": {
          "KO": "중간 정류장 없이 고속 운행:\n\n• 7000 → 사당\n• 5100 → 강남\n• 1112 → 잠실, 구의(건대 근처)\n• 1560 → 강남\n• G5100 → 강남 🚌 2층 버스\n\n소요 시간: 약 1시간 (퇴근 시간 추가 소요)\n⚠️ 입석 불가 — 좌석 없으면 다음 버스 이용\n💡 대부분 경희대 기점 → 좌석 확보 비교적 수월",
          "EN": "Express service with no stops in between:\n\n• 7000 → Sadang\n• 5100 → Gangnam\n• 1112 → Jamsil, Guui (near Konkuk Univ.)\n• 1560 → Gangnam\n• G5100 → Gangnam 🚌 double-decker bus\n\nTravel time: about 1 hour (longer during rush hour)\n⚠️ No standing room — if there are no seats, take the next bus\n💡 Most start from KHU → relatively easy to get a seat",
          "ZH": "全程高速、中间不停站：\n\n• 7000 → 舍堂\n• 5100 → 江南\n• 1112 → 蚕室、九宜（建国大学附近）\n• 1560 → 江南\n• G5100 → 江南 🚌 双层巴士\n\n所需时间：约 1 小时（下班高峰时段会更久）\n⚠️ 不可站立 —— 没座位就坐下一班\n💡 大多以庆熙大学为始发站 → 相对容易抢到座位",
          "VI": "Chạy tốc hành, không dừng ở trạm trung gian:\n\n• 7000 → Sadang\n• 5100 → Gangnam\n• 1112 → Jamsil, Guui (gần ĐH Konkuk)\n• 1560 → Gangnam\n• G5100 → Gangnam 🚌 xe buýt hai tầng\n\nThời gian: khoảng 1 tiếng (giờ tan tầm sẽ lâu hơn)\n⚠️ Không được đứng — hết ghế thì đi chuyến sau\n💡 Phần lớn xuất phát từ ĐH Kyung Hee → tương đối dễ có chỗ ngồi",
          "UZ": "Oraliq to'xtashlarsiz yuqori tezlikda haydash:\n\n• 7,000 → ziyoratgoh\n• 5100 → Gangnam\n• 1112 → Jamsil, Guui (Konkuk universiteti yaqinida)\n• 1560 → Gangnam\n• G5100 → Gangnam 🚌 ikki qavatli avtobus\n\nDavomiyligi: Taxminan 1 soat (tirbandlikdan keyin qo'shimcha vaqt talab qilinadi)\n⚠️ Tik turish mumkin emas — agar o'rindiqlar bo'lmasa, keyingi avtobusga o'tirasiz.\n💡 Ko'pchilik o'rinlarni Kyung Hee Universitetidan → olish nisbatan oson",
          "MN": "Дунд зогсоолгүй өндөр хурдтай жолоодох:\n\n• 7,000 → сүм\n• 5100 → Гангнам\n• 1112 → Жамсил, Гуи (Конкук их сургуулийн ойролцоо)\n• 1560 → Гангнам\n• G5100 → Гангнам 🚌 хоёр давхар автобус\n\nҮргэлжлэх хугацаа: Ойролцоогоор 1 цаг (ачааллын цагаас хойш нэмэлт хугацаа шаардлагатай)\n⚠️ Зогсох хориглоглол — суудал байхгүй бол дараагийн автобусанд сууна.\n💡 Ихэнх суудлыг Кён Хи их сургуулиас авах нь харьцангуй амархан →"
        }
      },
      {
        "icon": "⚠️",
        "title": {
          "KO": "1550-1 탑승 방향 주의",
          "EN": "1550-1: Mind Your Direction",
          "ZH": "1550-1 路：注意乘车方向",
          "VI": "1550-1: Lưu ý hướng đi",
          "UZ": "1550-1 Bortga chiqish yo'nalishi ehtiyotkorligi",
          "MN": "1550-1 Суух чиглэл: Анхааруулах"
        },
        "content": {
          "KO": "반대로 타는 사례가 종종 있습니다!\n\n• 강남 방면 → 정문 (경희대정문 정류장)\n• 한신대 방면 → 정건 (경희대학교 정류장)\n\n만석 상황이 종종 발생합니다.",
          "EN": "People often board in the wrong direction!\n\n• Toward Gangnam → Front Gate (KHU Front Gate stop)\n• Toward Hanshin Univ. → Jeonggeon (Kyung Hee University stop)\n\nThe bus often fills up.",
          "ZH": "经常有人坐反方向！\n\n• 江南方向 → 正门（庆熙大学正门站）\n• 韩神大学方向 → 正建（庆熙大学站）\n\n经常会出现满座的情况。",
          "VI": "Rất hay có người lên nhầm hướng!\n\n• Hướng Gangnam → Cổng chính (trạm Cổng chính ĐH Kyung Hee)\n• Hướng ĐH Hanshin → Jeonggeon (trạm Đại học Kyung Hee)\n\nXe thường xuyên hết chỗ.",
          "UZ": "Ko'pincha qarama-qarshi tomoni yonib ketadigan holatlar bo'ladi!\n\n• Asosiy darvoza Gangnam tomon → (Kyunghee universiteti asosiy darvozasi bekati)\n• Hanshin universiteti tomon→ Jeonggeon (Kyung Hee universiteti avtobus bekati)\n\nTo'liq band xonalar ko'pincha uchraydi.",
          "MN": "Ихэвчлэн эсрэг тал нь шатдаг тохиолдлууд тохиолддог!\n\n• Гол хаалга → Гангнам руу чиглэсэн (Кёнхи их сургуулийн гол хаалганы буудал)\n• Ханшин их сургууль руу→ Жонгён (Кён Хи их сургуулийн автобусны буудал)\n\nБүрэн захиалсан өрөө ихэвчлэн тохиолддог."
        }
      },
      {
        "icon": "🚇",
        "title": {
          "KO": "M5107 — 서울 도심 직행",
          "EN": "M5107 — Direct to Downtown Seoul",
          "ZH": "M5107 —— 直达首尔市中心",
          "VI": "M5107 — Đi thẳng trung tâm Seoul",
          "UZ": "M5107 — Seul markaziga to'g'ridan-to'g'ri",
          "MN": "M5107 — Сөүл хотын төв рүү шууд"
        },
        "content": {
          "KO": "M버스(광역급행버스): 경희대 ↔ 을지로·시청·서울역\n• 교내 진입, 무료 탑승 가능\n\n💡 운행 시간 전 탑승 시: 기사님이 정건에서 내렸다가 다시 탑승하도록 안내할 수 있습니다. 단말기 비활성 상태이므로 안내에 따라 행동하면 됩니다.",
          "EN": "M-Bus (Metropolitan Express Bus): KHU ↔ Euljiro · City Hall · Seoul Station\n• Enters campus, can board for free\n\n💡 If you board before the service start time: the driver may ask you to get off at Jeonggeon and re-board. The card terminal is inactive, so just follow the driver's instructions.",
          "ZH": "M 巴士（广域急行巴士）：庆熙大学 ↔ 乙支路·市厅·首尔站\n• 可进入校内，免费乘车\n\n💡 在运营时间之前上车时：司机可能会让你在正建下车后再重新上车。由于刷卡机处于未激活状态，按司机的指引操作即可。",
          "VI": "Xe buýt M (xe buýt tốc hành liên vùng): ĐH Kyung Hee ↔ Euljiro · Tòa thị chính · Ga Seoul\n• Vào tận khuôn viên, được lên xe miễn phí\n\n💡 Nếu lên xe trước giờ vận hành: tài xế có thể hướng dẫn bạn xuống ở Jeonggeon rồi lên lại. Vì máy quẹt thẻ chưa kích hoạt nên cứ làm theo hướng dẫn của tài xế.",
          "UZ": "M avtobusi (Metropolitan Express avtobusi): Kyung Hee universiteti ↔ Euljiro, shahar hokimligi, Seul vokzali\n• Kampusga kirish va bepul internat mavjud\n\n💡 Agar belgilangan ish vaqtidan oldin chiqsangiz: haydovchi sizni asosiy stansiyada tushishga va yana chiqishga yo'naltirishi mumkin. Qurilma faol emas, shuning uchun ko'rsatmalarga amal qiling.",
          "MN": "M автобус (Метрополитан Экспресс автобус): Кён Хи Их ↔ Сургуулийн Эүлжиро, Хотын захиргаа, Сөүл өртөө\n• Кампус руу орох боломжтой ба үнэгүй дотуур байр авах боломжтой\n\n💡 Хэрэв та төлөвлөсөн ажлын цагаас өмнө суувал: жолооч таныг гол буудал дээр бууж, дахин суухыг зааж өгнө. Төхөөрөмж идэвхгүй байгаа тул зааврыг дага."
        }
      },
      {
        "icon": "🚶",
        "title": {
          "KO": "영통역 → 학교 이동 팁",
          "EN": "Yeongtong Station → Campus Tips",
          "ZH": "永通站 → 学校 出行小贴士",
          "VI": "Mẹo di chuyển ga Yeongtong → trường",
          "UZ": "Yeongtong stansiyasiga maktabga borish → maslahatlar",
          "MN": "Ёнтонг өртөөнд сургуульд очих → зөвлөгөө"
        },
        "content": {
          "KO": "영통역에서 학교까지 도보 약 15분.\n특히 자대(전정대)·국제대·중앙도서관 쪽은 버스 이용 권장.\n\n• 시간·체력 여유: 정문까지 도보 → 정문에서 무료 탑승\n• 시간 애매: 6번 출구 → 310번 또는 900번 → 정건 하차 후 지하보도\n• 걷기 싫음: 6번 출구 → 9번 대기 (배차 간격 있음)\n• 지각 직전: 8번 출구 → 빨간 버스 (요금 발생)\n\n⚠️ 310번·900번은 정건 하차 후 지하보도를 건너야 합니다.",
          "EN": "It's about a 15-minute walk from Yeongtong Station to campus.\nTaking the bus is recommended especially for the Electronics/Information College, International College, and Central Library areas.\n\n• Plenty of time and energy: walk to the Front Gate → ride free from the Front Gate\n• In-between on time: Exit 6 → bus 310 or 900 → get off at Jeonggeon and use the underpass\n• Don't want to walk: Exit 6 → wait for bus 9 (intervals between buses)\n• About to be late: Exit 8 → red express bus (fare applies)\n\n⚠️ For buses 310 and 900, you get off at Jeonggeon and have to cross the underpass.",
          "ZH": "从永通站到学校步行约 15 分钟。\n尤其是去本部（电子信息学院）、国际学院、中央图书馆方向，建议坐公交。\n\n• 时间体力都充裕：步行到正门 → 在正门免费乘车\n• 时间不太够：6 号出口 → 310 路或 900 路 → 在正建下车后走地下通道\n• 不想走路：6 号出口 → 等 9 路（有发车间隔）\n• 快迟到了：8 号出口 → 红色巴士（要收费）\n\n⚠️ 310 路、900 路要在正建下车后穿过地下通道。",
          "VI": "Từ ga Yeongtong đi bộ đến trường khoảng 15 phút.\nĐặc biệt nếu đi về phía Khoa chính (Khoa Điện tử - Thông tin), Khoa Quốc tế, Thư viện Trung tâm thì nên đi xe buýt.\n\n• Dư dả thời gian và sức khỏe: đi bộ đến Cổng chính → lên xe miễn phí từ Cổng chính\n• Thời gian hơi sát: Lối ra 6 → xe 310 hoặc 900 → xuống ở Jeonggeon rồi đi đường hầm\n• Lười đi bộ: Lối ra 6 → đợi xe 9 (có giãn cách giữa các chuyến)\n• Sắp muộn giờ: Lối ra 8 → xe buýt đỏ (mất phí)\n\n⚠️ Xe 310 và 900 phải xuống ở Jeonggeon rồi băng qua đường hầm.",
          "UZ": "Yeongtong stansiyasidan maktabgacha taxminan 15 daqiqalik piyoda masofa.\nXususan, avtobuslar Jajeong universiteti (Jeonjeong universiteti), Xalqaro universitet va Markaziy kutubxona uchun tavsiya etiladi.\n\n• Vaqt va chidamlilik: Asosiy darvozaga piyoda borish → asosiy darvozadan bepul chiqish\n• Vaqt noaniq: Jeonggeon → 310 yoki 900 → 6-chi chiqishda tushing va yer osti yo'lagidan chiqing\n• Agar piyoda yurishni xohlamasangiz: Avtobus 9→ uchun 6-chi chiqishda kuting (avtobuslar orasidagi intervallar amal qiladi)\n• Kechikishdan oldin: Qizil avtobus → 8-chi chiqish (to'lov olinadi)\n\n⚠️ 310 va 900 yo'llari Jeonggeonda tushib, yer ostidan o'tgandan keyin qabul qilinishi kerak.",
          "MN": "Ёнтонг өртөөнөөс сургууль хүртэл ойролцоогоор 15 минутын алхах зайтай.\nЯлангуяа автобусыг Жажон их сургууль (Жонжон их сургууль), Олон улсын их сургууль, Төв номын санд санал болгодог.\n\n• Цаг ба тэсвэр тэвчээр: Гол хаалганы → гол хаалганаас үнэгүй суух боломжтой\n• Цаг тодорхойгүй: Jeongeond-→ 310 эсвэл 90→0 дугаар гарц дээр буугаад, газар доорх гарцаар гарна уу\n• Хэрвээ та алхахыг хүсэхгүй бол: Автобус 9→ 6-р гарц хүртэл хүлээгээрэй (автобусны хоорондын завсарлага хамаарна)\n• Хоцорхоос өмнө: Улаан автобус → 8-р гарц (төлбөр хамаарна)\n\n⚠️ 310 болон 900 дугаар чиглэлүүдийг Жонжонгонд бууж, доогуур гарцыг гаталсны дараа явах ёстой."
        }
      }
    ]
  },
  {
    "id": "FOOD",
    "title": {
      "KO": "맛집",
      "EN": "Restaurants",
      "ZH": "美食店",
      "VI": "Quán ăn ngon",
      "UZ": "Restoranlar",
      "MN": "Ресторанууд"
    },
    "emoji": "🍽️",
    "color": "#E8650A",
    "tips": [
      {
        "icon": "🥟",
        "title": {
          "KO": "사담손만두 — 한식",
          "EN": "Sadamson Mandu — Korean Food",
          "ZH": "萨达姆孙饺子 —— 韩餐",
          "VI": "Sadamson Mandu — Món Hàn",
          "UZ": "Sadamson Dumplings — Koreys Oshxonasi",
          "MN": "Sadamson Dumpling — Солонгосын хоол"
        },
        "content": {
          "KO": "추천 메뉴: 만두전골, 튀김만두\n\n만두전골은 가는 인원보다 1인분 적게 시킬 것을 권장할 만큼 만두 양이 압도적입니다. 튀김만두도 끝판왕급 바삭함을 자랑합니다.",
          "EN": "Recommended: dumpling hot pot, fried dumplings\n\nThe dumpling hot pot is so generous that we'd suggest ordering one portion fewer than the number of people in your group. The fried dumplings boast top-tier crispiness too.",
          "ZH": "推荐菜：饺子火锅、炸饺子\n\n饺子火锅的饺子量大到建议你比实际人数少点一份。炸饺子也酥脆到顶级水平。",
          "VI": "Món gợi ý: lẩu bánh xếp, bánh xếp chiên\n\nLẩu bánh xếp có lượng bánh nhiều đến mức nên gọi ít hơn số người một phần. Bánh xếp chiên cũng giòn ở mức đỉnh cao.",
          "UZ": "Tavsiya etilgan menyu: Dumpling hot pot, qovurilgan dumplinglar\n\nDumpling hot pot shunchalik saxiyki, men siz xohlagan odamlar sonidan kamroq bir porsiya buyurtma qilishni tavsiya qilaman. Qovurilgan mantilar ham yuqori darajadagi qarsildoqqa ega.",
          "MN": "Зөвлөж буй цэс: Баншны халуун тогоо, шарсан банш\n\nБаншны халуун тогоо маш өгөөмөр учраас хүссэн хүнээс бага нэг порц захиалахыг зөвлөж байна. Шарсан бууз нь мөн хамгийн өндөр чанартай хагаралттай байдаг."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ-WvQaDJQezURZRmpOAZlYEM"
      },
      {
        "icon": "🍜",
        "title": {
          "KO": "좌우지간 — 바지락칼국수",
          "EN": "Jwawujigan — Clam Kalguksu",
          "ZH": "左右之间 —— 蛤蜊刀削面",
          "VI": "Jwawujigan — Mì kalguksu nghêu",
          "UZ": "Chap va o'ng — Clam Kalguksu",
          "MN": "Зүүн ба баруун — Клам Калгуксу"
        },
        "content": {
          "KO": "추천 메뉴: 바지락칼국수, 냉면, 만두\n\n냉면·만두 전문점이지만 바지락칼국수의 바지락 양이 특히 인상적입니다. 콧물 날 것 같은 날에 생각나는 집.",
          "EN": "Recommended: clam kalguksu (knife-cut noodle soup), cold noodles, dumplings\n\nIt's mainly a cold-noodle and dumpling place, but the sheer amount of clams in the clam kalguksu is especially impressive. The spot you crave on a sniffly cold day.",
          "ZH": "推荐菜：蛤蜊刀削面、冷面、饺子\n\n虽然是冷面和饺子专门店，但蛤蜊刀削面里的蛤蜊量尤其惊人。鼻子要流鼻涕的那种天气就会想起这家店。",
          "VI": "Món gợi ý: mì kalguksu nghêu, mì lạnh, bánh xếp\n\nDù là quán chuyên mì lạnh và bánh xếp, nhưng lượng nghêu trong tô kalguksu nghêu đặc biệt ấn tượng. Quán mà bạn sẽ thèm vào những ngày trời lạnh sụt sịt.",
          "UZ": "Tavsiya etilgan menyu: Mollyuska kalguksu, sovuq lapsha, pelmenlar\n\nGarchi bu sovuq noodle va dumpling maxsus do'koni bo'lsa-da, mollyusk kalguksu ichidagi mollyuskalar miqdori ayniqsa hayratlanarli. Burunim oqib ketayotgandek bo'lsa, uyimni o'ylayman.",
          "MN": "Зөвлөмжтэй цэс: Хясаа калгуксу, хүйтэн гоймон, бууз\n\nХүйтэн гоймон, баншны тусгай дэлгүүр боловч хясааны кальгуксу дахь хясааны тоо онцгой гайхалтай. Хамар минь урсаж байгаа мэт санагдаж байгаа өдрүүдэд би гэрээ боддог."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJney8-NtEezURmTbw_SibryY"
      },
      {
        "icon": "🥩",
        "title": {
          "KO": "천보현 — 점심특선 6,900원",
          "EN": "Cheonbohyeon — ₩6,900 Lunch Special",
          "ZH": "千宝贤 —— 午餐特价 6,900 韩元",
          "VI": "Cheonbohyeon — Suất trưa đặc biệt 6.900 won",
          "UZ": "Cheon Bo-hyun — Tushlik maxsus taomi 6,900 von",
          "MN": "Чон Бо-хён — Өдрийн хоолны тусгай 6,900 вон"
        },
        "content": {
          "KO": "추천 메뉴: 육회비빔밥 + 차돌된장찌개 (점심특선)\n\n6,900원짜리 점심특선이 핵심입니다. 육회비빔밥은 유명 고깃집보다 낫다는 평도 있을 정도.",
          "EN": "Recommended: yukhoe bibimbap + brisket doenjang stew (lunch special)\n\nThe ₩6,900 lunch special is the main draw. Some say the yukhoe bibimbap is even better than at famous meat restaurants.",
          "ZH": "推荐菜：生牛肉拌饭 + 牛胸肉大酱汤（午餐特价）\n\n6,900 韩元的午餐特价是亮点。生牛肉拌饭甚至有人评价说比有名的烤肉店还好吃。",
          "VI": "Món gợi ý: cơm trộn thịt bò sống + canh tương đậu ức bò (suất trưa đặc biệt)\n\nSuất trưa đặc biệt 6.900 won là điểm nhấn. Cơm trộn thịt bò sống còn được nhận xét là ngon hơn cả các quán thịt nướng nổi tiếng.",
          "UZ": "Tavsiya etilgan menyu: Yukhoe Bibimbap + Brisket Doenjang Stew (Tushlik uchun maxsus taom)\n\n6,900 vonlik tushlik maxsus tanlovi eng yorqin voqea hisoblanadi. Ba'zilar yukhoe bibimbapni mashhur barbekyu restoranlaridan ham yaxshiroq deb hisoblaydi.",
          "MN": "Санал болгож буй цэс: Yukhoe Bibimbap + Brisket Doenjang шөл (Өдрийн хоолны тусгай хоол)\n\n6,900 вонгийн өдрийн хоолны тусгай үйлчилгээ хамгийн онцлох нь юм. Зарим хүмүүс yukhoe bibimbap нь алдартай шарсан махны ресторануудаас ч илүү сайн гэж ярьдаг."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ8UDQnNxEezURxVPGqSxDea0"
      },
      {
        "icon": "🍚",
        "title": {
          "KO": "밥은화 — 가성비 끝판왕",
          "EN": "Babeunhwa — Best Bang for Your Buck",
          "ZH": "Bap Eunhwa —— 性价比之王",
          "VI": "Bap Eunhwa — Vua giá hời",
          "UZ": "Bap Eunhwa — Pulning eng yuqori qiymati",
          "MN": "Бап Ынхва — Мөнгөний хамгийн үнэ цэнэтэй бүтээл"
        },
        "content": {
          "KO": "추천 메뉴: 쭈꾸미숙주덮밥, 닭껍질교자튀김\n\n3,500~5,500원대의 가성비 끝판왕 체인점입니다. 쭈꾸미숙주덮밥에 맥주 한 잔 조합이 강추. 닭껍질교자튀김은 맥주 안주로 딱. 단, 평일 점심엔 웨이팅 각오 필요.",
          "EN": "Recommended: spicy baby-octopus & bean-sprout rice bowl, fried chicken-skin dumplings\n\nA chain with unbeatable value in the ₩3,500–5,500 range. Highly recommend pairing the octopus rice bowl with a beer. The fried chicken-skin dumplings are a perfect beer snack. Just be ready to wait at weekday lunch.",
          "ZH": "推荐菜：小章鱼绿豆芽盖饭、炸鸡皮饺子\n\n这是一家 3,500～5,500 韩元价位、性价比之王的连锁店。强烈推荐小章鱼绿豆芽盖饭配一杯啤酒。炸鸡皮饺子非常适合做下酒菜。不过工作日中午要做好排队的准备。",
          "VI": "Món gợi ý: cơm bạch tuộc nhỏ & giá đỗ, bánh xếp da gà chiên\n\nChuỗi quán vô địch giá hời ở tầm 3.500–5.500 won. Cực kỳ khuyến nghị combo cơm bạch tuộc với một ly bia. Bánh xếp da gà chiên thì hợp làm mồi nhậu hết sảy. Tuy nhiên, buổi trưa ngày thường phải chuẩn bị tinh thần xếp hàng.",
          "UZ": "Tavsiya etilgan menyu: Oktapus va loviya ko'chasi, guruch idishi, qovurilgan tovuq terisi dumplinglari\n\nBu 3,500~5,500 von oralig'idagi eng yuqori qiymatli zanjir hisoblanadi. To'rli oyoqli ahtapot va mung loviya novdasi bilan bir stakan pivo kombinatsiyasi juda tavsiya etiladi. Qovurilgan tovuq terisidan tayyorlangan gyoza pivo uchun juda mos. Biroq, ish kunlari tushlikni kutishga tayyor bo'ling.",
          "MN": "Зөвлөж буй цэс: Наймаалж ба шошны наалдаатай будаа аяга, шарсан тахианы арьсны бууз\n\nЭнэ бол 3,500~5,500 вонгийн хүрээнд хамгийн үнэ цэнэтэй сүлжээ юм. Webfoot октопус болон мунг буурцагийн наалдаатай будааны аяга болон нэг аяга шар айрагны хослолыг маш их зөвлөж байна. Шарсан тахианы арьстай гёза нь шар айрагны амттангаар төгс тохирно. Гэхдээ ажлын өдрүүдэд өдрийн хоолны өмнө хүлээхэд бэлэн байгаарай."
        },
        "link": "https://www.google.com/maps/place/%EB%B0%A5%EC%9D%80%ED%99%94+%EA%B2%BD%ED%9D%AC%EB%8C%80%EA%B5%AD%EC%A0%9C%EC%BA%A0%ED%8D%BC%EC%8A%A4%EC%A0%90/data=!3m1!4b1!4m6!3m5!1s0x357b452e7b0d177b:0x1f5efd10481b8e25!8m2!3d37.2465428!4d127.0764846!16s%2Fg%2F11rsbp4tg8?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D"
      },
      {
        "icon": "🌶️",
        "title": {
          "KO": "청진옥 — 제육볶음",
          "EN": "Cheongjinok — Spicy Stir-Fried Pork",
          "ZH": "青津屋 —— 辣炒猪肉",
          "VI": "Cheongjinok — Thịt heo xào cay",
          "UZ": "Cheongjinok — Achchiq qovurilgan qovurma",
          "MN": "Чонжинок — Халуун халуун шарсан мах"
        },
        "content": {
          "KO": "추천 메뉴: 제육볶음\n\n제육볶음이 맛있습니다. 사담손만두에서 길 건너편에 위치.",
          "EN": "Recommended: spicy stir-fried pork\n\nThe spicy stir-fried pork is delicious. Located across the street from Sadamson Mandu.",
          "ZH": "推荐菜：辣炒猪肉\n\n辣炒猪肉很好吃。就在萨达姆孙饺子店的马路对面。",
          "VI": "Món gợi ý: thịt heo xào cay\n\nThịt heo xào cay rất ngon. Nằm bên kia đường so với quán Sadamson Mandu.",
          "UZ": "Tavsiya etilgan menyu: Achchiq qovurilgan cho'chqa go'shti\n\nQovurilgan cho'chqa go'shti juda mazali. Sadamson Dumplings ko'chasining qarshisida joylashgan.",
          "MN": "Зөвлөж буй цэс: Халуун халуун шарсан гахайн мах\n\nШарсан гахайн мах амттай байна. Sadamson Dumplings-ийн эсрэг талд байрладаг."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJg_sLqdlEezURd28V2oN1avY"
      },
      {
        "icon": "🐙",
        "title": {
          "KO": "어반드림 — 고등어·쭈꾸미",
          "EN": "Urban Dream — Mackerel & Baby Octopus",
          "ZH": "都市梦 —— 鲭鱼·小章鱼",
          "VI": "Urban Dream — Cá thu & Bạch tuộc nhỏ",
          "UZ": "Urban Dream — Makrel, To'r oyoqli o'ktapot",
          "MN": "Хотын мөрөөдөл — Макреэл, Вэбфут наймаалж"
        },
        "content": {
          "KO": "추천 메뉴: 점심특선 고등어구이, 쭈꾸미\n\n가격은 살짝 부담스러울 수 있으나 맛은 그만큼 보장됩니다. 함께 나오는 샐러드가 고소하고 맛있다는 후기.",
          "EN": "Recommended: lunch-special grilled mackerel, spicy baby octopus\n\nThe price can feel a bit steep, but the taste lives up to it. Reviewers say the side salad that comes with it is nutty and tasty.",
          "ZH": "推荐菜：午餐特价烤鲭鱼、小章鱼\n\n价格可能稍微有点贵，但味道也对得起这个价。有评价说配的沙拉很香很好吃。",
          "VI": "Món gợi ý: cá thu nướng suất trưa đặc biệt, bạch tuộc nhỏ\n\nGiá có thể hơi đắt một chút, nhưng hương vị xứng đáng với điều đó. Có review nói món salad ăn kèm rất bùi và ngon.",
          "UZ": "Tavsiya etilgan menyu: Maxsus tushlik taomi: grilda pishirilgan makrel, to'rli oktapot\n\nNarxi biroz qimmat bo'lishi mumkin, lekin ta'mi ham kafolatlangan. Sharhlarda salat bilan birga taqdim etilgan salat mazali va mazali deb aytiladi.",
          "MN": "Зөвлөмж цэс: Өдрийн хоолны тусгай хоол: шарсан макрель, вэбфут наймаалж\n\nҮнэ нь арай өндөр байж болох ч амт нь баталгаатай. Шүүмжүүдэд салат нь амттай, амттай гэж бичсэн."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ7wmg4MREezUR0hXGUKxxgOY"
      },
      {
        "icon": "🍱",
        "title": {
          "KO": "전주본가 — 돈까스·제육",
          "EN": "Jeonju Bonga — Tonkatsu & Spicy Pork",
          "ZH": "全州本家 —— 炸猪排·辣炒猪肉",
          "VI": "Jeonju Bonga — Tonkatsu & thịt heo xào cay",
          "UZ": "Jeonju Bonga — cho'chqa kotleti · cho'chqa go'shti",
          "MN": "Жонжу Бонга — Гахайн мах · гахайн мах"
        },
        "content": {
          "KO": "추천 메뉴: 돈까스, 콩나물순두부찌개, 제육볶음",
          "EN": "Recommended: tonkatsu, bean-sprout soft-tofu stew, spicy stir-fried pork",
          "ZH": "推荐菜：炸猪排、豆芽嫩豆腐汤、辣炒猪肉",
          "VI": "Món gợi ý: tonkatsu, canh đậu hũ non giá đỗ, thịt heo xào cay",
          "UZ": "Tavsiya etilgan menyu: Cho'chqa kotleti, loviya karamli yumshoq tofu sho'rva, qovurilgan cho'chqa go'shti",
          "MN": "Зөвлөмж цэс: Гахайн котлет, шошны наалдаатай зөөлөн тофугийн шөл, шарсан гахайн мах"
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJef10VtlEezURvUDjsg76Kj4"
      },
      {
        "icon": "🍲",
        "title": {
          "KO": "부대통령 — 밥 무한리필",
          "EN": "Budaetongnyeong — Free Rice Refills",
          "ZH": "副大统领 —— 米饭无限续",
          "VI": "Budaetongnyeong — Thêm cơm miễn phí",
          "UZ": "Vitse-prezident — Unlimited Rice",
          "MN": "Дэд ерөнхийлөгч — Хязгааргүй будаа"
        },
        "content": {
          "KO": "추천 메뉴: 우렁된장찌개, 닭갈비\n\n밥 무한리필 가능합니다. 배가 많이 고픈 날 찌개 하나에 밥 두 공기도 거뜬합니다.",
          "EN": "Recommended: snail doenjang stew, dakgalbi (spicy chicken)\n\nUnlimited rice refills. On a really hungry day, two bowls of rice with one stew is no problem.",
          "ZH": "推荐菜：田螺大酱汤、辣炒鸡排\n\n米饭可以无限续。特别饿的时候，一锅汤配两碗饭也轻松吃下。",
          "VI": "Món gợi ý: canh tương đậu ốc, dakgalbi (gà xào cay)\n\nThêm cơm không giới hạn. Vào ngày đói meo, một nồi canh ăn kèm hai bát cơm cũng dễ dàng.",
          "UZ": "Tavsiya etilgan menyu: Salyangoz soya pastasi sho'rva, dakgalbi\n\nCheksiz guruch to'ldirish imkoniyatlari mavjud. Juda och bo'lgan kunlarda, bitta sho'rva bilan ikki piyola guruch olishingiz mumkin.",
          "MN": "Зөвлөмж цэс: Хавчны шар буурцагийн пастай шөл, дакгалби\n\nХязгааргүй будаагаар дүүргэх боломжтой. Маш их өлссөн өдрүүдэд нэг шөлөөр хоёр аяга будаа амархан авч болно."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJz6NtewBFezURKR4SwIWsiJ4"
      },
      {
        "icon": "🥩",
        "title": {
          "KO": "맛돈 — 볶음밥",
          "EN": "Matdon — Fried Rice",
          "ZH": "Matdon —— 炒饭",
          "VI": "Matdon — Cơm chiên",
          "UZ": "Matdon — Qovurilgan guruch",
          "MN": "Матдон — Шарсан будаа"
        },
        "content": {
          "KO": "추천 메뉴: 볶음밥\n\n나쁘지 않은 가성비의 고깃집입니다. 방학 중 리모델링 이력 있음, 개강 후 영업 여부 확인 권장.",
          "EN": "Recommended: fried rice\n\nA meat restaurant with decent value. It has been renovated during a vacation before, so it's worth checking whether it's open after the semester starts.",
          "ZH": "推荐菜：炒饭\n\n这是一家性价比还不错的烤肉店。假期期间有过装修记录，建议开学后确认是否营业。",
          "VI": "Món gợi ý: cơm chiên\n\nMột quán thịt nướng có giá hời khá ổn. Từng có lịch sử sửa sang trong kỳ nghỉ, nên sau khi vào học bạn nên kiểm tra xem quán có mở cửa không.",
          "UZ": "Tavsiya etilgan menyu: Qovurilgan guruch\n\nBu barbekyu restorani bo'lib, narxi yaxshi bo'ladi. Agar sizda ta'til paytida ta'mirlash tarixi bo'lsa, semestr boshlangandan keyin biznes mavjudligini tekshirish tavsiya etiladi.",
          "MN": "Зөвлөмж цэс: Шарсан будаа\n\nЭнэ бол үнэ цэнэтэй шарсан махны ресторан. Хэрэв та амралтын үеэр засвар хийсэн түүхтэй бол улирал эхэлсний дараа бизнесийн боломжийн эсэхийг шалгахыг зөвлөж байна."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJHQ7yUdlEezURAkRfwhDiC0w"
      },
      {
        "icon": "🍖",
        "title": {
          "KO": "주호식당 — 소고기전골",
          "EN": "Juho Restaurant — Beef Hot Pot",
          "ZH": "周浩食堂 —— 牛肉火锅",
          "VI": "Quán Juho — Lẩu thịt bò",
          "UZ": "Juho Restorani — Beef Hot Pot",
          "MN": "Жухо ресторан — Үхрийн халуун пот"
        },
        "content": {
          "KO": "추천 메뉴: 소고기전골, 새우튀김\n\n메인은 술집이지만 소고기전골이 특히 맛있습니다. 안주류 전반적으로 수준급.",
          "EN": "Recommended: beef hot pot, fried shrimp\n\nIt's mainly a bar, but the beef hot pot is especially good. The bar snacks are high quality across the board.",
          "ZH": "推荐菜：牛肉火锅、炸虾\n\n虽然主打是酒馆，但牛肉火锅尤其好吃。下酒菜整体水准都很高。",
          "VI": "Món gợi ý: lẩu thịt bò, tôm chiên\n\nChủ yếu là quán nhậu, nhưng lẩu thịt bò đặc biệt ngon. Các món nhắm nhìn chung đều ở mức chất lượng cao.",
          "UZ": "Tavsiya etilgan menyu: Mol go'shti issiq qozon, qovurilgan qisqichbaqalar\n\nAsosiy restoran bar bo'lsa-da, mol go'shti issiq poti ayniqsa mazali. Umuman olganda, zakuskalar yuqori sifatda.",
          "MN": "Зөвлөмж цэс: Үхрийн халуун тогоо, шарсан сам хорхой\n\nГол ресторан нь баар боловч үхрийн махтай халуун тогоо нь онцгой амттай. Ерөнхийдөө амттанууд өндөр чанартай."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJP9IBBdxEezURoLqX905ON48"
      },
      {
        "icon": "🍱",
        "title": {
          "KO": "겐코 — 대창덮밥",
          "EN": "Genko — Beef Intestine Rice Bowl",
          "ZH": "源光 —— 肥肠盖饭",
          "VI": "Genko — Cơm lòng bò",
          "UZ": "Genko — Qalin ichakdagi guruch idishi",
          "MN": "Генко — Том гэдэсний будааны аяга"
        },
        "content": {
          "KO": "추천 메뉴: 대창덮밥 (매운맛 추천), 나가사키, 새우장동\n\n대창덮밥은 느끼할 수 있으니 매운맛으로 주문을 권장합니다. 점심 웨이팅이 있지만 기다릴 만합니다.",
          "EN": "Recommended: beef-intestine rice bowl (go spicy), Nagasaki ramen, soy-marinated shrimp bowl\n\nThe intestine rice bowl can get rich, so we suggest ordering it spicy. There's a lunch wait, but it's worth it.",
          "ZH": "推荐菜：肥肠盖饭（推荐辣味）、长崎汤面、酱虾盖饭\n\n肥肠盖饭可能会有点腻，建议点辣味。中午要排队，但值得等。",
          "VI": "Món gợi ý: cơm lòng bò (nên chọn vị cay), mì Nagasaki, cơm tôm ngâm tương\n\nCơm lòng bò có thể hơi ngấy nên khuyên bạn gọi vị cay. Buổi trưa có xếp hàng nhưng đáng để chờ.",
          "UZ": "Tavsiya etilgan taomlar: Daechang guruch idishi (achchiq ta'm uchun tavsiya etiladi), Nagasaki, qisqichbaqalar sousi\n\nDaechang guruch idishlari yog'li bo'lishi mumkin, shuning uchun ularni achchiq ta'mga ega buyurtma qilishni tavsiya qilaman. Tushlik uchun kutish bor, lekin kutishga arziydi.",
          "MN": "Санал болгож буй хоол: Daechang будааны аяга (халуун амттай учраас зөвлөмжлөгддөг), Nagasaki, сам хорхойны соус\n\nDaechang будааны аяга тослог байж болох тул халуун амттай захиалахыг зөвлөж байна. Өдрийн хоолны хүлээлт бий, гэхдээ хүлээх үнэ цэнэтэй."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ-wo3VZ1FezURRaMr3qgcWUM"
      },
      {
        "icon": "🍛",
        "title": {
          "KO": "부타센세 — 부타동",
          "EN": "Buta Sensei — Pork Bowl (Butadon)",
          "ZH": "Buta 老师 —— 猪肉盖饭",
          "VI": "Buta Sensei — Butadon (cơm thịt heo)",
          "UZ": "Buta Sensei — Buta-dong",
          "MN": "Бүта Сэнсэй — Бута-донг"
        },
        "content": {
          "KO": "추천 메뉴: 부타동, 오야코동\n\n메뉴가 심플한 편입니다. 호불호가 다소 갈리는 편.",
          "EN": "Recommended: butadon (pork bowl), oyakodon\n\nThe menu is fairly simple. Opinions are somewhat divided — love it or not.",
          "ZH": "推荐菜：猪肉盖饭、亲子盖饭\n\n菜单比较简单。口味上有点见仁见智。",
          "VI": "Món gợi ý: butadon (cơm thịt heo), oyakodon\n\nThực đơn khá đơn giản. Khẩu vị thì người thích người không, hơi chia rẽ.",
          "UZ": "Tavsiya etilgan menyu: Buta don, Oyako don\n\nMenyu nisbatan oddiy. Fikrlar biroz bo'linib ketgan.",
          "MN": "Зөвлөмж цэс: Бута дон, Ояко дон\n\nЦэс харьцангуй энгийн. Санал бодол нь бага зэрэг хуваагдсан."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ3bGH4KZFezUR6ykAoH6WXiw"
      },
      {
        "icon": "🥩",
        "title": {
          "KO": "키와마루아지 — 규동",
          "EN": "Kiwamaruaji — Gyudon (Beef Bowl)",
          "ZH": "Kiwamaruaji —— 牛肉盖饭",
          "VI": "Kiwamaruaji — Gyudon (cơm thịt bò)",
          "UZ": "Kiwamaruaji — Gyudong",
          "MN": "Кивамаруажи — Гюдонг"
        },
        "content": {
          "KO": "추천 메뉴: 규동\n\n규동 하나만큼은 강력 추천합니다.",
          "EN": "Recommended: gyudon\n\nThe gyudon alone gets a strong recommendation.",
          "ZH": "推荐菜：牛肉盖饭\n\n光是牛肉盖饭就强烈推荐。",
          "VI": "Món gợi ý: gyudon\n\nRiêng món gyudon thì rất đáng để thử.",
          "UZ": "Tavsiya etilgan menyu: Gyudon (Gyudon noodles)\n\nMen faqat bitta Gyudongni tavsiya qilaman.",
          "MN": "Зөвлөмжтэй цэс: Гюдон (Гюдон гоймон)\n\nБи зөвхөн нэг Gyudong-г л зөвлөж байна."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJjdj9ctxEezURsW0wTs6kmrw"
      },
      {
        "icon": "🍤",
        "title": {
          "KO": "쿠지라 — 텐동 (영통 유일)",
          "EN": "Kujira — Tendon (Only One in Yeongtong)",
          "ZH": "Kujira —— 天妇罗盖饭（永通唯一）",
          "VI": "Kujira — Tendon (duy nhất ở Yeongtong)",
          "UZ": "Kujira — Tendong (faqat Yeongtong)",
          "MN": "Кужира — Тэндон (зөвхөн Ёнтонг)"
        },
        "content": {
          "KO": "추천 메뉴: 텐동\n\n영통 유일의 텐동 전문점입니다. 가격이 있는 만큼 맛도 보장됩니다. 가게 구조상 수용 인원이 적으니 참고.",
          "EN": "Recommended: tendon (tempura rice bowl)\n\nThe only tendon specialist in Yeongtong. It costs a bit, but the taste is guaranteed. Note that the layout means it can only seat a few people.",
          "ZH": "推荐菜：天妇罗盖饭\n\n永通唯一的天妇罗盖饭专门店。价格稍高，但味道也有保证。店面结构上能容纳的人数较少，请留意。",
          "VI": "Món gợi ý: tendon (cơm tempura)\n\nQuán tendon duy nhất ở Yeongtong. Giá có cao một chút nhưng hương vị được đảm bảo. Lưu ý là do cấu trúc quán nên sức chứa khá ít.",
          "UZ": "Tavsiya etilgan menyu: Tendon\n\nBu Yeongtongdagi yagona tendonli maxsus restoran. Narxi ko'rsatmasin, ta'mi kafolatlangan. Iltimos, restoranning tuzilishi sababli sig'imi cheklanganligini yodda tuting.",
          "MN": "Зөвлөмжтэй цэс: Шөрмөс\n\nЭнэ бол Ёнтонг дахь цорын ганц шөрмөсний тусгай ресторан. Үнийн хувьд амт нь баталгаатай. Ресторан нь бүтэцийн улмаас багтаамжийн хязгаарлагдмал гэдгийг анхаарна уу."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJdSeSBdlEezURWQMcJFkyaxQ"
      },
      {
        "icon": "🥩",
        "title": {
          "KO": "미미카츠 — 돈가스",
          "EN": "Mimikatsu — Tonkatsu",
          "ZH": "Mimikatsu —— 炸猪排",
          "VI": "Mimikatsu — Tonkatsu",
          "UZ": "Mimikatsu — Tonkatsu",
          "MN": "Мимикацу — Тонкацу"
        },
        "content": {
          "KO": "추천 메뉴: 돈가스\n\n맛있지만 시간이 지나면 눅눅해지는 편이라 빠르게 먹는 것을 추천합니다.",
          "EN": "Recommended: tonkatsu\n\nDelicious, but it tends to go soggy over time, so we recommend eating it quickly.",
          "ZH": "推荐菜：炸猪排\n\n很好吃，但放久了容易变软发潮，建议尽快吃完。",
          "VI": "Món gợi ý: tonkatsu\n\nNgon, nhưng để lâu dễ bị mềm ỉu nên khuyên bạn ăn nhanh.",
          "UZ": "Tavsiya etilgan menyu: Cho'chqa kotleti\n\nU mazali, lekin vaqt o'tishi bilan nam bo'lib qoladi, shuning uchun tezda yeb qo'yishni tavsiya qilaman.",
          "MN": "Зөвлөмжтэй цэс: Гахайн махны котлет\n\nАмттай ч цаг хугацааны явцад нойтон болдог тул хурдан идэхийг зөвлөж байна."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJow8U59hFezURBPLju5i66Rs"
      },
      {
        "icon": "🌶️",
        "title": {
          "KO": "얜시부 — 마라탕",
          "EN": "Yaensibu — Malatang",
          "ZH": "Yaensibu —— 麻辣烫",
          "VI": "Yaensibu — Malatang",
          "UZ": "Yapsibu — Malatang",
          "MN": "Япсибу — Малатанг"
        },
        "content": {
          "KO": "추천 메뉴: 마라탕, 마라샹궈, 꿔바로우, 계란볶음밥\n\n마라탕 맛집으로 정평이 나 있습니다. 마라탕과 계란볶음밥 조합이 일품.",
          "EN": "Recommended: malatang, mala xiang guo, guobaorou (sweet & sour pork), egg fried rice\n\nA well-established go-to for malatang. The malatang + egg fried rice combo is outstanding.",
          "ZH": "推荐菜：麻辣烫、麻辣香锅、锅包肉、蛋炒饭\n\n以麻辣烫闻名、口碑很好。麻辣烫配蛋炒饭的组合堪称一绝。",
          "VI": "Món gợi ý: malatang, mala xiang guo, guobaorou (heo chua ngọt), cơm chiên trứng\n\nNổi tiếng và được khẳng định là quán malatang ngon. Combo malatang với cơm chiên trứng là tuyệt phẩm.",
          "UZ": "Tavsiya etilgan taomlar: Malatang sho'rva, mala xiangguo, Guobaorou, tuxumli qovurilgan guruch\n\nU malatang restorani sifatida mashhur. Mala sho'rva va tuxumli guruch kombinatsiyasi ajoyib.",
          "MN": "Санал болгож буй хоол: Малатан шөл, мала сянгуо, Гуобаороу, өндөгтэй шарсан будаа\n\nЭнэ нь малатанг ресторан гэдгээрээ сайн танигдсан. Мала шөл болон өндөгтэй шарсан будааны хослол нь гайхалтай."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ_zJG5BpFezURN3GLNS7NHdE"
      },
      {
        "icon": "🥢",
        "title": {
          "KO": "짜마차이나 — 김치삼겹덮밥",
          "EN": "Jjamachina — Kimchi Pork Belly Bowl",
          "ZH": "Jjamachina —— 泡菜五花肉盖饭",
          "VI": "Jjamachina — Cơm ba chỉ heo kim chi",
          "UZ": "Chama China — Kimchi cho'chqa qorinli guruch idishi",
          "MN": "Чама Хятад — Кимчи гахайн гэдэсний будааны аяга"
        },
        "content": {
          "KO": "추천 메뉴: 김치삼겹덮밥",
          "EN": "Recommended: kimchi pork belly rice bowl",
          "ZH": "推荐菜：泡菜五花肉盖饭",
          "VI": "Món gợi ý: cơm ba chỉ heo kim chi",
          "UZ": "Tavsiya etilgan menyu: Kimchi cho'chqa go'shtli guruchli idish",
          "MN": "Зөвлөмж цэс: Кимчи гахайн гэдэсний будааны сав"
        },
        "link": "https://maps.app.goo.gl/D11jSRYZg4aeonq97"
      },
      {
        "icon": "🌶️",
        "title": {
          "KO": "두가지 떡볶이 — 로제",
          "EN": "Dugaji Tteokbokki — Rosé",
          "ZH": "两种炒年糕 —— 玫瑰奶油（Rosé）",
          "VI": "Dugaji Tteokbokki — Rosé",
          "UZ": "Two Tteokbokki — Rosé",
          "MN": "Хоёр Ттокпокки — Розэ"
        },
        "content": {
          "KO": "추천 메뉴: 로제떡볶이, 닭껍질튀김, 오돌뼈\n\n로제떡볶이가 원픽. 조리 시간이 다소 걸리지만 기다릴 만한 맛입니다.",
          "EN": "Recommended: rosé tteokbokki, fried chicken skin, spicy pork cartilage\n\nThe rosé tteokbokki is the top pick. It takes a while to cook, but the taste is worth the wait.",
          "ZH": "推荐菜：玫瑰奶油炒年糕、炸鸡皮、辣炒脆骨\n\n玫瑰奶油炒年糕是首选。出餐稍微有点慢，但味道值得等。",
          "VI": "Món gợi ý: tteokbokki sốt rosé, da gà chiên, sụn heo xào cay\n\nTteokbokki sốt rosé là lựa chọn số một. Nấu hơi lâu một chút nhưng hương vị thì đáng để chờ.",
          "UZ": "Tavsiya etilgan menyu: Atirgul tteokbokki, Qovurilgan tovuq terisi, cho'chqa karpi\n\nRose tteokbokki mening eng yaxshi tanlovim. Pishirish biroz vaqt oladi, lekin ta'mi kutishga arziydi.",
          "MN": "Зөвлөмж цэс: Сарнай Ттокпокки, Шарсан тахианы арьс, Гахайн загас\n\nРоуз ттокпокки бол миний хамгийн сайн сонголт. Бага зэрэг хоол хийх цаг шаарддаг ч амт нь хүлээх үнэ цэнэтэй."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJc6ng9NtEezURh560XwubxY8"
      },
      {
        "icon": "🍱",
        "title": {
          "KO": "분식나라 김밥마을",
          "EN": "Bunsik Nara Gimbap Maeul",
          "ZH": "Bunsik Nara 紫菜包饭村",
          "VI": "Làng Gimbap Bunsik Nara",
          "UZ": "Bunsik Nara Gimbap qishlog'i",
          "MN": "Бунсик Нара Гимбап тосгон"
        },
        "content": {
          "KO": "추천 메뉴: 알밥, 카레칼국수",
          "EN": "Recommended: fish-roe rice bowl (albap), curry kalguksu",
          "ZH": "推荐菜：鱼籽饭、咖喱刀削面",
          "VI": "Món gợi ý: cơm trứng cá (albap), kalguksu cà ri",
          "UZ": "Tavsiya etilgan menyu: Roe guruch, karrili calguksu",
          "MN": "Зөвлөмжтэй цэс: Роэ будаа, карри калгуксу"
        },
        "link": "https://maps.app.goo.gl/dNku4UjpvkHZiGdn9"
      },
      {
        "icon": "🧁",
        "title": {
          "KO": "로코블링 — 마카롱",
          "EN": "Rocobling — Macarons",
          "ZH": "Rocobling —— 马卡龙",
          "VI": "Rocobling — Macaron",
          "UZ": "Rocobling — Makaron",
          "MN": "Рокоблинг — Макарон"
        },
        "content": {
          "KO": "추천 메뉴: 마카롱 (전 메뉴)\n\n수원 마카롱 맛집으로 알려져 있습니다. 인스타그램에서 메뉴 확인 권장.",
          "EN": "Recommended: macarons (all flavors)\n\nKnown as a top macaron spot in Suwon. Check the menu on Instagram.",
          "ZH": "推荐菜：马卡龙（全部口味）\n\n是水原有名的马卡龙店。建议在 Instagram 上查看菜单。",
          "VI": "Món gợi ý: macaron (tất cả các loại)\n\nĐược biết đến là quán macaron ngon ở Suwon. Nên xem thực đơn trên Instagram.",
          "UZ": "Tavsiya etilgan menyu: Makaronlar (barcha menyu mahsulotlari)\n\nU Suvonda mashhur makaron restorani sifatida tanilgan. Instagramda menyuni ko'rib chiqishni tavsiya qilaman.",
          "MN": "Зөвлөж буй цэс: Макарон (бүх цэсний зүйлс)\n\nЭнэ нь Сувонд алдартай макарон ресторан гэдгээрээ алдартай. Instagram дээр цэсийг шалгахыг зөвлөж байна."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ_QG7bdxEezURHvehCDhvmIU"
      },
      {
        "icon": "🍓",
        "title": {
          "KO": "청춘과수원 — 과일 전문점",
          "EN": "Cheongchun Orchard — Fruit Specialist",
          "ZH": "青春果园 —— 水果专门店",
          "VI": "Cheongchun Orchard — Chuyên về trái cây",
          "UZ": "Yoshlar bog'i — Meva maxsus do'koni",
          "MN": "Залуу жимсний жимсний цэцэрлэг — Жимсний тусгай дэлгүүр"
        },
        "content": {
          "KO": "추천 메뉴: 제철 과일컵, 바나나아몬드 생과일주스\n\n기숙사생에게 특히 강추하는 과일 전문점입니다. 쿠폰 적립 꼭 챙기세요. 사장님이 친절하기로 유명합니다.",
          "EN": "Recommended: seasonal fruit cup, banana-almond fresh juice\n\nA fruit shop especially recommended for dorm students. Be sure to collect your stamp coupons. The owner is famous for being kind.",
          "ZH": "推荐菜：当季水果杯、香蕉杏仁鲜榨果汁\n\n特别推荐给宿舍生的水果专门店。一定要记得集优惠券。老板以亲切著称。",
          "VI": "Món gợi ý: cốc trái cây theo mùa, nước ép tươi chuối hạnh nhân\n\nQuán trái cây đặc biệt được khuyên cho sinh viên ở ký túc xá. Nhớ tích phiếu giảm giá nhé. Chủ quán nổi tiếng thân thiện.",
          "UZ": "Tavsiya etilgan menyu: Mavsumiy mevali stakanlar, banan, bodom, yangi meva sharbati\n\nUshbu meva maxsus do'koni ayniqsa yotoqxona aholisi uchun tavsiya etiladi. Kuponlar topishga ishonch hosil qiling. Egasi do'stona bo'lishi bilan mashhur.",
          "MN": "Зөвлөмж цэс: Улирлын жимсний аяга, банан, бүйлс, шинэхэн жимсний шүүс\n\nЭнэхүү жимсний тусгай дэлгүүр нь дотуур байрны оршин суугчдад онцгой зөвлөмжтэй. Купон заавал аваарай. Эзэн нь найрсаг зангаараа алдартай."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJ_1l6JdxEezURLfoVeMyhey4"
      },
      {
        "icon": "☕",
        "title": {
          "KO": "더마스터커피 — 숨은 카페",
          "EN": "The Master Coffee — Hidden Café",
          "ZH": "The Master Coffee —— 隐藏咖啡馆",
          "VI": "The Master Coffee — Quán cà phê ẩn",
          "UZ": "Master Coffee — Yashirin Kafe",
          "MN": "Мастер Кофе — Нууц кафе"
        },
        "content": {
          "KO": "추천 메뉴: 초코케이크, 에그타르트 (데워서), 아메리카노\n\n얜시부에서 세븐일레븐 쪽으로 돌아가면 있는, 다소 숨어 있는 카페입니다. 꾸덕하고 달달한 초코케이크가 시그니처.",
          "EN": "Recommended: chocolate cake, egg tart (warmed up), Americano\n\nA somewhat hidden café you'll find if you head back from Yaensibu toward the 7-Eleven. The dense, sweet chocolate cake is the signature.",
          "ZH": "推荐菜：巧克力蛋糕、蛋挞（加热后）、美式咖啡\n\n从 Yaensibu 往 7-Eleven 方向走回去就能找到，是一家比较隐蔽的咖啡馆。浓郁香甜的巧克力蛋糕是招牌。",
          "VI": "Món gợi ý: bánh sô-cô-la, bánh tart trứng (hâm nóng), Americano\n\nMột quán cà phê khá kín đáo, đi từ Yaensibu vòng về phía 7-Eleven là thấy. Bánh sô-cô-la đặc và ngọt là món signature.",
          "UZ": "Tavsiya etilgan menyu: Shokoladli tort, tuxumli tort (isitilgan), Americano\n\nAgar Yapsibudan 7-Eleven tomon qaytsangiz, bu biroz yashirin kafe. Imzo — boy va shirin shokoladli tort.",
          "MN": "Зөвлөмжтэй цэс: Чоко бялуу, өндөгний тарт (дулаацсан), Американо\n\nЯпсибугаас буцаж 7-Eleven рүү эргэвэл энэ нь жаахан нууц кафе болно. Онцлог нь баялаг, чихэрлэг шоколадан бялуу юм."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJSeSSR9lEezURYKbL9gQ8lzw"
      },
      {
        "icon": "🍧",
        "title": {
          "KO": "스노우화이트 — 팥빙수",
          "EN": "Snow White — Patbingsu",
          "ZH": "白雪公主 —— 红豆刨冰",
          "VI": "Snow White — Patbingsu (đá bào đậu đỏ)",
          "UZ": "Qorqiz — Qizil loviya Bingsu",
          "MN": "Цасан цагаан — Улаан шош бингсу"
        },
        "content": {
          "KO": "추천 메뉴: 팥빙수 (2인분 / 4명이서 나눠먹기 최적)\n\n프랜차이즈 빙수 전문점입니다. 4명이 2인분으로 배불리 먹는 가성비가 포인트. 눈꽃얼음 스타일은 아님을 참고하세요.",
          "EN": "Recommended: red-bean bingsu (a 2-person size is perfect to split among 4)\n\nA franchise bingsu shop. The value highlight: 4 people can share 2 servings and still get full. Note that it's not the soft snowflake-ice style.",
          "ZH": "推荐菜：红豆刨冰（两人份 / 四人分着吃最划算）\n\n是连锁刨冰专门店。亮点在于四人点两人份就能吃饱，性价比很高。请注意，这不是雪花冰那种口感。",
          "VI": "Món gợi ý: bingsu đậu đỏ (phần 2 người / chia cho 4 người là hợp lý nhất)\n\nQuán bingsu thuộc chuỗi nhượng quyền. Điểm cộng về giá hời: 4 người ăn 2 phần vẫn no căng. Lưu ý đây không phải kiểu đá bông tuyết mềm mịn.",
          "UZ": "Tavsiya etilgan menyu: Red Bean Shaved Ice (2 yoki 4 kishi uchun ideal)\n\nBu franchayzing uchun mo'ljallangan muzqaymoq maxsus do'koni. To'rt kishi uchun qiymat ikki kishi uchun yetarli. Iltimos, bu muz uslubi emasligini unutmang.",
          "MN": "Зөвлөж буй цэс: Red Bean Shaved Ice (2 хүн эсвэл 4 хүн хуваалцахад тохиромжтой)\n\nЭнэ бол франчайзын мөсний тусгай дэлгүүр. Дөрвөн хүний үнэ цэнэтэй бол хоёр хүн хангалттай идэж чадна. Анхаарна уу, энэ нь цасан ширхэгтэй мөсний хэв маяг биш гэдгийг анхаарна уу."
        },
        "link": "https://maps.app.goo.gl/zGfhggDE2taLQZJ16"
      },
      {
        "icon": "🥗",
        "title": {
          "KO": "푸오코 — 샐러드",
          "EN": "Fuoco — Salad",
          "ZH": "Fuoco —— 沙拉",
          "VI": "Fuoco — Salad",
          "UZ": "Puoco — Salat",
          "MN": "Пуоко — Салат"
        },
        "content": {
          "KO": "추천 메뉴: 카야잼 샌드위치, 계란샐러드\n\n샐러드 전문점. 양이 많고 맛있습니다. 메뉴는 인스타그램 참고 권장.",
          "EN": "Recommended: kaya jam sandwich, egg salad\n\nA salad specialist. Generous portions and tasty. Check Instagram for the menu.",
          "ZH": "推荐菜：咖椰酱三明治、鸡蛋沙拉\n\n沙拉专门店。分量大又好吃。菜单建议参考 Instagram。",
          "VI": "Món gợi ý: sandwich mứt kaya, salad trứng\n\nQuán chuyên salad. Phần ăn nhiều và ngon. Thực đơn nên tham khảo trên Instagram.",
          "UZ": "Tavsiya etilgan menyu: Kaya murabbo sendvichi, tuxumli salat\n\nSalatga ixtisoslashgan restoran. Porsiyalar saxiy va mazali. Menyu uchun Instagram sahifasiga murojaat qiling.",
          "MN": "Зөвлөмжтэй цэс: Кая чанамал сэндвич, өндөгний салат\n\nСалатны тусгай ресторан. Порц нь элбэг, амттай. Цэсийг Instagram-аас үзнэ үү."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJV_dl1aZFezURMNnXoJFWhDw"
      },
      {
        "icon": "🍕",
        "title": {
          "KO": "솔피 — 씬 도우 피자",
          "EN": "Solpi — Thin-Crust Pizza",
          "ZH": "Solpi —— 薄底披萨",
          "VI": "Solpi — Pizza đế mỏng",
          "UZ": "Solfi — Yupqa Xamirli Pitsa",
          "MN": "Solfi — нимгэн зуурмагтай пицца"
        },
        "content": {
          "KO": "추천 메뉴: 씬 도우 피자, 사이드 메뉴\n\n파바 뒤 반지하에 위치. 얇은 도우를 선호한다면 강추. 내부 리모델링 완료. 피맥 조합으로 딱 좋습니다.",
          "EN": "Recommended: thin-crust pizza, side dishes\n\nLocated in the semi-basement behind Paris Baguette. Highly recommended if you like thin crust. The interior has been renovated. Perfect for a pizza-and-beer combo.",
          "ZH": "推荐菜：薄底披萨、配菜\n\n位于 Paris Baguette（巴黎贝甜）后面的半地下。喜欢薄底的话强烈推荐。内部已重新装修。披萨配啤酒的组合刚刚好。",
          "VI": "Món gợi ý: pizza đế mỏng, món phụ\n\nNằm ở tầng bán hầm phía sau Paris Baguette. Cực kỳ khuyến nghị nếu bạn thích đế mỏng. Nội thất đã được sửa sang lại. Combo pizza với bia thì hợp hết nấc.",
          "UZ": "Tavsiya etilgan menyu: Thin-Dow pizzasi, garnirlar\n\nPava orqasidagi yarim podvalda joylashgan. Agar yupqa xamirni afzal ko'rsangiz, juda tavsiya etiladi. Ichki ta'mir ishlari yakunlandi. Bu Phymax kombinatsiyasi uchun juda mos.",
          "MN": "Зөвлөж буй цэс: Thin-Dow пицца, хажуугийн хоолнууд\n\nПавагийн ард хагас доод давхарт байрладаг. Хэрвээ та нимгэн зуурмаг илүүд үздэг бол маш их зөвлөж байна. Дотоод засвар хийгдсэн. Phymax комбод төгс тохирно."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJFxk7tC5FezURX7yjI4KoF5I"
      },
      {
        "icon": "🌯",
        "title": {
          "KO": "맥시모브리또 — 브리또",
          "EN": "Maximo Burrito — Burritos",
          "ZH": "Maximo Burrito —— 墨西哥卷",
          "VI": "Maximo Burrito — Burrito",
          "UZ": "Maximo Burrito — Burto",
          "MN": "Максимо Буррито — Бурто"
        },
        "content": {
          "KO": "추천 메뉴: 브리또\n\n영통 브리또 맛집으로 도스마스보다 맛있다는 평가가 있습니다.",
          "EN": "Recommended: burrito\n\nYeongtong's go-to burrito spot — some say it's even better than Dos Mas.",
          "ZH": "推荐菜：墨西哥卷\n\n是永通有名的墨西哥卷店，有评价说比 Dos Mas 还好吃。",
          "VI": "Món gợi ý: burrito\n\nQuán burrito nổi tiếng ở Yeongtong, có người đánh giá còn ngon hơn cả Dos Mas.",
          "UZ": "Tavsiya etilgan menyu: Burrito\n\nYeongtong mashhur burto restorani bo'lib, Dosmasdan ham yuqori baholangan.",
          "MN": "Зөвлөмж цэс: Буррито\n\nЁнтонг бол алдартай бурто ресторан бөгөөд Досмасаас ч илүү үнэлэгддэг."
        },
        "link": "https://www.google.com/maps/place/?q=place_id:ChIJWzFvZNxEezURbyQQNSHcEmA"
      }
    ]
  },
  {
    "id": "CAMPUS_SITE",
    "title": {
      "KO": "학교 사이트",
      "EN": "Campus Websites",
      "ZH": "学校网站",
      "VI": "Website của trường",
      "UZ": "Maktab veb-sayti",
      "MN": "Сургуулийн вэбсайт"
    },
    "emoji": "🔗",
    "color": "#1565C0",
    "tips": [
      {
        "icon": "🏫",
        "title": {
          "KO": "경희대 공식 홈페이지",
          "EN": "KHU Official Website",
          "ZH": "庆熙大学官方网站",
          "VI": "Trang chính thức của ĐH Kyung Hee",
          "UZ": "Kyung Hee Universiteti rasmiy veb-sayti",
          "MN": "Кён Хи Их Сургуулийн албан ёсны вэбсайт"
        },
        "content": {
          "KO": "공지사항, 학교 전반 안내\nkhu.ac.kr",
          "EN": "Announcements and general university information\nkhu.ac.kr",
          "ZH": "公告通知、学校综合信息\nkhu.ac.kr",
          "VI": "Thông báo, thông tin chung về trường\nkhu.ac.kr",
          "UZ": "E'lonlar, umumiy maktab ma'lumotlari\nkhu.ac.kr",
          "MN": "Мэдэгдэл, Ерөнхий сургуулийн мэдээлэл\nkhu.ac.kr"
        },
        "link": "https://www.khu.ac.kr/"
      },
      {
        "icon": "📋",
        "title": {
          "KO": "인포21 — 수강신청·성적·학사",
          "EN": "Info21 — Registration, Grades, Academics",
          "ZH": "Info21 —— 选课·成绩·学务",
          "VI": "Info21 — Đăng ký môn, điểm số, học vụ",
          "UZ": "Info21 — Kurslarni ro'yxatdan o'tkazish, baholar, akademik daraja",
          "MN": "Мэдээлэл21 — Хичээлийн бүртгэл, дүн, академик зэрэг"
        },
        "content": {
          "KO": "수강신청, 성적 조회, 학사 일정 등 학사 전반 관리\ninfo21.khu.ac.kr",
          "EN": "Manages all academic affairs — course registration, grade lookup, academic calendar, and more\ninfo21.khu.ac.kr",
          "ZH": "选课、成绩查询、学务日程等学务事项的综合管理\ninfo21.khu.ac.kr",
          "VI": "Quản lý toàn bộ học vụ như đăng ký môn, tra cứu điểm, lịch học vụ, v.v.\ninfo21.khu.ac.kr",
          "UZ": "Kurslarni ro'yxatdan o'tkazish, baho so'rovi va o'quv jadvalini o'z ichiga olgan keng qamrovli akademik boshqaruv\ninfo21.khu.ac.kr",
          "MN": "Хичээлийн бүртгэл, дүнгийн шалгалт, академик хуваарь зэрэг иж бүрэн академик удирдлага\ninfo21.khu.ac.kr"
        },
        "link": "https://info21.khu.ac.kr/"
      },
      {
        "icon": "💻",
        "title": {
          "KO": "e-Campus — 강의·과제·출결",
          "EN": "e-Campus — Lectures, Assignments, Attendance",
          "ZH": "e-Campus —— 课程·作业·考勤",
          "VI": "e-Campus — Bài giảng, bài tập, điểm danh",
          "UZ": "e-Kampus — Ma'ruzalar, topshiriqlar, qatnashuv",
          "MN": "e-Campus — лекц, даалгавар, оролцоо"
        },
        "content": {
          "KO": "온라인 강의 수강, 과제 제출, 출결 관리\ne-campus.khu.ac.kr",
          "EN": "Take online lectures, submit assignments, manage attendance\ne-campus.khu.ac.kr",
          "ZH": "在线听课、提交作业、考勤管理\ne-campus.khu.ac.kr",
          "VI": "Học bài giảng trực tuyến, nộp bài tập, quản lý điểm danh\ne-campus.khu.ac.kr",
          "UZ": "Onlayn ma'ruzalarga qatnashing, topshiriqlarni topshiring, davomatni boshqarish\ne-campus.khu.ac.kr",
          "MN": "Онлайн лекцүүдэд оролцож, даалгавар илгээх, ирцийг удирдах\ne-campus.khu.ac.kr"
        },
        "link": "https://e-campus.khu.ac.kr/"
      },
      {
        "icon": "📚",
        "title": {
          "KO": "국제캠퍼스 중앙도서관",
          "EN": "International Campus Central Library",
          "ZH": "国际校区中央图书馆",
          "VI": "Thư viện Trung tâm cơ sở Quốc tế",
          "UZ": "Xalqaro Kampus Markaziy Kutubxonasi",
          "MN": "Олон улсын кампусын төв номын сан"
        },
        "content": {
          "KO": "도서 검색, 열람실 이용\nlib.khu.ac.kr",
          "EN": "Book search, reading room access\nlib.khu.ac.kr",
          "ZH": "图书检索、阅览室使用\nlib.khu.ac.kr",
          "VI": "Tìm sách, sử dụng phòng đọc\nlib.khu.ac.kr",
          "UZ": "Kitob qidirish, o'quv zallariga kirish\nlib.khu.ac.kr",
          "MN": "Ном хайх, уншлагын өрөөнд нэвтрэх эрх\nlib.khu.ac.kr"
        },
        "link": "https://lib.khu.ac.kr/"
      },
      {
        "icon": "🗓️",
        "title": {
          "KO": "스터디룸 예약",
          "EN": "Study Room Booking",
          "ZH": "自习室预约",
          "VI": "Đặt phòng học",
          "UZ": "O'qish xonasini band qilish",
          "MN": "Судалгааны өрөөний захиалга"
        },
        "content": {
          "KO": "그룹 스터디룸 온라인 예약\nkhu-kr.libcal.com",
          "EN": "Book group study rooms online\nkhu-kr.libcal.com",
          "ZH": "团体自习室在线预约\nkhu-kr.libcal.com",
          "VI": "Đặt phòng học nhóm trực tuyến\nkhu-kr.libcal.com",
          "UZ": "Guruhli o'quv xonasini onlayn bron qilish\nkhu-kr.libcal.com",
          "MN": "Бүлгийн судалгааны өрөө онлайн захиалга\nkhu-kr.libcal.com"
        },
        "link": "https://khu-kr.libcal.com/"
      },
      {
        "icon": "🏛️",
        "title": {
          "KO": "학사지원과 — 휴·복학·학적",
          "EN": "Academic Affairs Office — Leave, Return, Records",
          "ZH": "学务支援科 —— 休学·复学·学籍",
          "VI": "Phòng Hỗ trợ Học vụ — Nghỉ học, học lại, học bạ",
          "UZ": "Akademik Qo'llab-quvvatlash Bo'limi — Ta'til, Qayta ishga qabul qilish va Akademik Tadqiqotlar",
          "MN": "Академик дэмжлэгийн хэлтэс — Чөлөө, дахин ажилдаа орсон болон академик судалгаа"
        },
        "content": {
          "KO": "휴학, 복학, 학적 변동 등 학사 행정 처리\nghaksa.khu.ac.kr",
          "EN": "Handles academic administration like leave of absence, returning to school, and enrollment changes\nghaksa.khu.ac.kr",
          "ZH": "休学、复学、学籍变动等学务行政办理\nghaksa.khu.ac.kr",
          "VI": "Xử lý hành chính học vụ như nghỉ học, học lại, thay đổi học bạ\nghaksa.khu.ac.kr",
          "UZ": "Akademik ma'muriy jarayonlar, masalan, ta'til, tiklash va akademik o'zgarishlar\nghaksa.khu.ac.kr",
          "MN": "Чөлөө, сэргээх, академийн өөрчлөлт зэрэг академик удирдлагын боловсруулалт\nghaksa.khu.ac.kr"
        },
        "link": "http://ghaksa.khu.ac.kr/"
      },
      {
        "icon": "🏠",
        "title": {
          "KO": "생협 — 식당·매점·귀향버스",
          "EN": "Co-op — Cafeteria, Store, Hometown Bus",
          "ZH": "生协 —— 食堂·便利店·返乡巴士",
          "VI": "Hợp tác xã — Căng tin, cửa hàng, xe về quê",
          "UZ": "Kooperativ — Restoran, Snack Bar, Homecoming avtobusi",
          "MN": "Хамтын ажиллагаа — Ресторан, зуушны баар, Гэрийн буцалтын автобус"
        },
        "content": {
          "KO": "학생식당, 매점, 귀향버스 예약 등\nkhucoop.com",
          "EN": "Student cafeteria, convenience store, hometown bus reservations, and more\nkhucoop.com",
          "ZH": "学生食堂、便利店、返乡巴士预约等\nkhucoop.com",
          "VI": "Căng tin sinh viên, cửa hàng tiện lợi, đặt xe buýt về quê, v.v.\nkhucoop.com",
          "UZ": "Talabalar oshxonasi, atıştırmalık bar, uy avtobuslari uchun bron qilish va boshqalar.\nkhucoop.com",
          "MN": "Оюутны хоолны газар, амттангийн газар, гэрийн автобусны захиалга гэх мэт.\nkhucoop.com"
        },
        "link": "https://khucoop.com/"
      },
      {
        "icon": "🏘️",
        "title": {
          "KO": "국제캠퍼스 기숙사",
          "EN": "International Campus Dormitory",
          "ZH": "国际校区宿舍",
          "VI": "Ký túc xá cơ sở Quốc tế",
          "UZ": "Xalqaro Kampus Yotoqxonasi",
          "MN": "Олон улсын кампусын дотуур байр"
        },
        "content": {
          "KO": "기숙사 신청, 생활 안내\ndorm2.khu.ac.kr",
          "EN": "Dormitory applications and living guide\ndorm2.khu.ac.kr",
          "ZH": "宿舍申请、生活指南\ndorm2.khu.ac.kr",
          "VI": "Đăng ký ký túc xá, hướng dẫn sinh hoạt\ndorm2.khu.ac.kr",
          "UZ": "Yotoqxonaga ariza, hayot qo'llanmasi\ndorm2.khu.ac.kr",
          "MN": "Дотуур байрны өргөдөл, Амьдралын гарын авлага\ndorm2.khu.ac.kr"
        },
        "link": "https://dorm2.khu.ac.kr/"
      },
      {
        "icon": "📱",
        "title": {
          "KO": "에브리타임 — 강의평가",
          "EN": "Everytime — Lecture Reviews",
          "ZH": "Everytime —— 课程评价",
          "VI": "Everytime — Đánh giá giảng dạy",
          "UZ": "Har safar — Kursni baholash",
          "MN": "Бүх удаа — Курсын үнэлгээ"
        },
        "content": {
          "KO": "재학생 커뮤니티, 강의평가 열람\n시간표 짜기 전 반드시 참고!\neverytime.kr",
          "EN": "Student community and lecture reviews\nA must-check before building your timetable!\neverytime.kr",
          "ZH": "在校生社区、查看课程评价\n排课表前一定要参考！\neverytime.kr",
          "VI": "Cộng đồng sinh viên, xem đánh giá giảng dạy\nNhất định phải tham khảo trước khi xếp thời khóa biểu!\neverytime.kr",
          "UZ": "Hozirgi Talabalar Hamjamiyati, Kurs Baholash Ko'rish\nJadvalingizni tuzishdan oldin tekshirishni unutmang!\neverytime.kr",
          "MN": "Одоогийн оюутны нийгэмлэг, Хичээлийн үнэлгээ үзэх\nХуваарь гаргахаасаа өмнө заавал шалгаарай!\neverytime.kr"
        },
        "link": "https://everytime.kr/"
      },
      {
        "icon": "📸",
        "title": {
          "KO": "경희대 공식 인스타그램",
          "EN": "KHU Official Instagram",
          "ZH": "庆熙大学官方 Instagram",
          "VI": "Instagram chính thức của ĐH Kyung Hee",
          "UZ": "Kyung Hee Universiteti Rasmiy Instagram",
          "MN": "Кён Хи Их Сургуулийн албан ёсны Instagram"
        },
        "content": {
          "KO": "학교 소식, 이벤트 안내\n@kyunghee_university",
          "EN": "University news and event announcements\n@kyunghee_university",
          "ZH": "学校动态、活动公告\n@kyunghee_university",
          "VI": "Tin tức của trường, thông báo sự kiện\n@kyunghee_university",
          "UZ": "Maktab yangiliklari va tadbirlar e'lonlari\n@kyunghee_university",
          "MN": "Сургуулийн мэдээ, үйл явдлын зарлал\n@kyunghee_university"
        },
        "link": "https://www.instagram.com/kyunghee_university/"
      }
    ]
  },
  {
    "id": "HUMANITIES",
    "title": {
      "KO": "후마니타스 교양",
      "EN": "Humanitas General Education",
      "ZH": "Humanitas 通识教育",
      "VI": "Giáo dục đại cương Humanitas",
      "UZ": "Humanitas madaniyati",
      "MN": "Humanitas соёл"
    },
    "emoji": "🎓",
    "color": "#6A1B9A",
    "tips": [
      {
        "icon": "📋",
        "title": {
          "KO": "필수교과 17학점",
          "EN": "Required Courses — 17 Credits",
          "ZH": "必修课程 17 学分",
          "VI": "Môn bắt buộc — 17 tín chỉ",
          "UZ": "Majburiy kurslardan 17 kredit",
          "MN": "17 кредит заавал судлах хичээлүүд"
        },
        "content": {
          "KO": "2024학년도 입학생 기준 필수교과 (총 17학점):\n\n• 인간의가치탐색 — 3학점 (1학년)\n• 세계와시민 — 3학점 (1학년)\n• 빅뱅에서문명까지 — 3학점 (전학년)\n• 성찰과표현 — 3학점 (1학년 필수, 주제연구 선수)\n• 주제연구 — 3학점 (2학년)\n• 대학영어 — 2학점 (1학년, 3시간 수업)\n\n국제캠퍼스: 대학영어를 한국어 과목으로 대체 가능",
          "EN": "Required courses for 2024 entrants (17 credits total):\n\n• Exploring Human Values — 3 cr (1st year)\n• The World and Citizens — 3 cr (1st year)\n• From the Big Bang to Civilization — 3 cr (any year)\n• Reflection and Expression — 3 cr (1st-year requirement, prerequisite for Thematic Research)\n• Thematic Research — 3 cr (2nd year)\n• College English — 2 cr (1st year, 3-hour class)\n\nInternational Campus: College English may be replaced with a Korean-language course",
          "ZH": "以 2024 学年入学生为准的必修课程（共 17 学分）：\n\n• 人类价值探索 —— 3 学分（一年级）\n• 世界与市民 —— 3 学分（一年级）\n• 从大爆炸到文明 —— 3 学分（不限年级）\n• 反思与表达 —— 3 学分（一年级必修，主题研究先修课）\n• 主题研究 —— 3 学分（二年级）\n• 大学英语 —— 2 学分（一年级，3 课时）\n\n国际校区：大学英语可用韩语科目替代",
          "VI": "Môn bắt buộc theo tân sinh viên khóa 2024 (tổng 17 tín chỉ):\n\n• Khám phá giá trị con người — 3 tín chỉ (năm 1)\n• Thế giới và Công dân — 3 tín chỉ (năm 1)\n• Từ Big Bang đến Văn minh — 3 tín chỉ (mọi khóa)\n• Suy ngẫm và Biểu đạt — 3 tín chỉ (bắt buộc năm 1, là môn tiên quyết của Nghiên cứu chuyên đề)\n• Nghiên cứu chuyên đề — 3 tín chỉ (năm 2)\n• Tiếng Anh đại học — 2 tín chỉ (năm 1, lớp 3 tiết)\n\nCơ sở Quốc tế: có thể thay Tiếng Anh đại học bằng môn tiếng Hàn",
          "UZ": "2024-yilgi qabul uchun majburiy kurslar (jami 17 kredit):\n\n• Insoniy qadriyatlarni o'rganish — 3 kredit (1-yil)\n• World and Citizens — 3 kredit (1-yil)\n• Katta portlashdan Sivilizatsiyagacha — 3 kredit (barcha sinflar)\n• Refleksiya va ifoda — 3 kredit (1-kurs uchun talab qilinadi, pre-tematik tadqiqot ustuvorligi)\n• Tematik tadqiqot — 3 kredit (2-kurs)\n• Kollej ingliz tili — 2 kredit (1-kurs, 3 soat dars)\n\nXalqaro kampus: Universitet ingliz tilini koreys tili kurslari bilan almashtirish mumkin",
          "MN": "2024 оны элсэлтийн заавал судлах хичээлүүд (нийт 17 кредит):\n\n• Хүний үнэт зүйлсийг судлах — 3 кредит (1-р жил)\n• World and Citizens — 3 кредит (1-р жил)\n• Том тэсрэлтээс иргэншил хүртэл — 3 кредит (бүх зэрэглэл)\n• Эргэцүүлэлт ба илэрхийлэл — 3 кредит (1-р курс, сэдэвчилсэн судалгааны тэргүүлэх чиглэлд шаардлагатай)\n• Сэдэвчилсэн судалгаа — 3 кредит (2-р жил)\n• Коллежийн англи хэл — 2 кредит (1-р курс, 3 цагийн хичээл)\n\nОлон улсын кампус: Их сургуулийн англи хэлний хичээлийг солонгос хэлний хичээлээр сольж болно"
        }
      },
      {
        "icon": "✍️",
        "title": {
          "KO": "성찰과표현 → 주제연구 선수",
          "EN": "Reflection & Expression → Prerequisite",
          "ZH": "反思与表达 → 主题研究先修课",
          "VI": "Suy ngẫm & Biểu đạt → môn tiên quyết",
          "UZ": "Tematik tadqiqotchi sportchi → mulohaza va ifoda",
          "MN": "Сэдэвчилсэн Судалгааны Тамирчин Эргэцүүлэлт ба Илэрхийлэл →"
        },
        "content": {
          "KO": "\"성찰과표현\"은 1학년 필수 과목이자 \"주제연구\"의 선수과목입니다.\n1학년 때 반드시 이수해야 2학년에 주제연구 수강이 가능합니다.",
          "EN": "\"Reflection and Expression\" is both a 1st-year required course and a prerequisite for \"Thematic Research.\"\nYou must complete it in your first year to take Thematic Research in your second year.",
          "ZH": "\"反思与表达\"既是一年级必修课，也是\"主题研究\"的先修课。\n必须在一年级修完，才能在二年级选修主题研究。",
          "VI": "\"Suy ngẫm và Biểu đạt\" vừa là môn bắt buộc năm 1, vừa là môn tiên quyết của \"Nghiên cứu chuyên đề\".\nPhải hoàn thành ở năm 1 thì năm 2 mới được học Nghiên cứu chuyên đề.",
          "UZ": "\"Refleksiya va ifoda\" birinchi kurs uchun majburiy fan bo'lib, \"Tematik tadqiqot\" uchun zarur hisoblanadi.\nIkkinchi yilda tematik tadqiqot kursini olish uchun uni birinchi yilda tugatishingiz kerak.",
          "MN": "\"Reflection and Expression\" нь анхны курсын заавал судлах хичээл бөгөөд \"Сэдэвчилсэн судалгаа\"-д урьдчилсан шаардлага юм.\nСэдэвчилсэн судалгааны хичээлийг хоёрдугаар жилдээ судлах боломжтой болохын тулд анхны жилдээ дуусгах ёстой."
        }
      },
      {
        "icon": "🌍",
        "title": {
          "KO": "배분이수교과 — 5영역 중 3개",
          "EN": "Distribution Requirements — 3 of 5 Areas",
          "ZH": "分配修读课程 —— 5 个领域选 3 个",
          "VI": "Môn phân bổ — 3 trong 5 lĩnh vực",
          "UZ": "Tayinlangan kurslar — 5 sohadan 3 tasi",
          "MN": "Хуваарилсан хичээлүүд — 5 чиглэлээс 3 нь"
        },
        "content": {
          "KO": "5개 영역 중 3개 이상 선택, 9학점 이상 이수:\n\n① 생명·우주·인간\n② 분석·추론·논리\n③ 상징·문화·소통\n④ 사회·공동체·평화\n⑤ 지능·정보·미래\n\n각 과목: 3시간 3학점",
          "EN": "Choose at least 3 of the 5 areas and complete at least 9 credits:\n\n① Life·Universe·Humanity\n② Analysis·Reasoning·Logic\n③ Symbol·Culture·Communication\n④ Society·Community·Peace\n⑤ Intelligence·Information·Future\n\nEach course: 3 hours, 3 credits",
          "ZH": "5 个领域中至少选 3 个，修满 9 学分以上：\n\n① 生命·宇宙·人类\n② 分析·推理·逻辑\n③ 象征·文化·沟通\n④ 社会·共同体·和平\n⑤ 智能·信息·未来\n\n每门课：3 课时 3 学分",
          "VI": "Chọn ít nhất 3 trong 5 lĩnh vực và hoàn thành từ 9 tín chỉ trở lên:\n\n① Sự sống·Vũ trụ·Con người\n② Phân tích·Suy luận·Logic\n③ Biểu tượng·Văn hóa·Giao tiếp\n④ Xã hội·Cộng đồng·Hòa bình\n⑤ Trí tuệ·Thông tin·Tương lai\n\nMỗi môn: 3 tiết, 3 tín chỉ",
          "UZ": "5 hududdan kamida 3 tasini tanlang va kamida 9 ta kredit to'plang:\n\n(1) Hayot, Makon, Insoniyat\n(2) Tahlil, xulosa chiqarish va mantiq\n(3) Ramziylik, madaniyat va kommunikatsiya\n(4) Jamiyat, jamoa va tinchlik\n(5) Razvedka, Ma'lumot va Kelajak\n\nHar bir kurs: 3 soat, 3 kredit",
          "MN": "5 чиглэлээс дор хаяж 3-ыг сонгож, дор хаяж 9 кредит авна:\n\n(1) Амьдрал, Орон зай, Хүн төрөлхтөн\n(2) Шинжилгээ, таамаглал, логик\n(3) Бэлгэдэл, Соёл, Харилцаа\n(4) Нийгэм, Нийгэм, Энх тайван\n(5) Оюун ухаан, мэдээлэл ба ирээдүй\n\nХичээл бүр: 3 цаг, 3 кредит"
        }
      },
      {
        "icon": "📊",
        "title": {
          "KO": "교양 이수학점 총정리",
          "EN": "General Education Credits Summary",
          "ZH": "通识学分总整理",
          "VI": "Tổng hợp tín chỉ đại cương",
          "UZ": "Gumanitar fanlar kreditlarining to'liq sharhi",
          "MN": "Чөлөөт урлагийн бүтээлүүдийн бүрэн тойм"
        },
        "content": {
          "KO": "• 필수교과: 17학점\n• 배분이수교과: 9학점 이상\n• 자유이수교과: 3학점 이상\n→ 합계 최소 29학점\n\n최대 인정:\n• 서울캠퍼스: 56학점\n• 국제캠퍼스: 50학점\n\n국제캠퍼스 자유이수: \"전공탐색및기업가정신세미나\" 필수 (외국인·편입생 면제)",
          "EN": "• Required courses: 17 credits\n• Distribution courses: 9+ credits\n• Free-elective courses: 3+ credits\n→ Minimum total: 29 credits\n\nMaximum recognized:\n• Seoul Campus: 56 credits\n• International Campus: 50 credits\n\nInternational Campus free electives: \"Major Exploration & Entrepreneurship Seminar\" required (waived for international and transfer students)",
          "ZH": "• 必修课程：17 学分\n• 分配修读课程：9 学分以上\n• 自由修读课程：3 学分以上\n→ 合计至少 29 学分\n\n最高认可学分：\n• 首尔校区：56 学分\n• 国际校区：50 学分\n\n国际校区自由修读：必修\"专业探索与创业精神研讨课\"（外国学生·插班生免修）",
          "VI": "• Môn bắt buộc: 17 tín chỉ\n• Môn phân bổ: từ 9 tín chỉ\n• Môn tự chọn tự do: từ 3 tín chỉ\n→ Tổng tối thiểu 29 tín chỉ\n\nCông nhận tối đa:\n• Cơ sở Seoul: 56 tín chỉ\n• Cơ sở Quốc tế: 50 tín chỉ\n\nMôn tự chọn tự do ở Cơ sở Quốc tế: bắt buộc \"Hội thảo Khám phá ngành & Tinh thần khởi nghiệp\" (miễn cho sinh viên nước ngoài và sinh viên chuyển tiếp)",
          "UZ": "• Majburiy kurslar: 17 kredit\n• Berilgan kurslar: 9 kredit yoki undan ko'p\n• Bepul kurslar: 3 kredit yoki undan ko'p\n→ Jami kamida 29 kredit\n\nMaksimal e'tirof:\n• Seul kampusi: 56 kredit\n• Xalqaro kampus: 50 kredit\n\nXalqaro Kampusda Bepul O'qish: \"Asosiy Kashfiyot va Tadbirkorlik Seminari\" majburiy (xorijliklar va ko'chib kelgan talabalar uchun ozod)",
          "MN": "• Шаардлагатай хичээлүүд: 17 кредит\n• Оноосон хичээлүүд: 9 ба түүнээс дээш кредит\n• Үнэгүй хичээлүүд: 3 кредит ба түүнээс дээш\n→ Хамгийн багадаа 29 кредит\n\nХамгийн их танигдалт:\n• Сөүл кампус: 56 кредит\n• Олон улсын кампус: 50 кредит\n\nОлон улсын кампусын үнэгүй судалгаа: \"Үндсэн судалгаа ба бизнес эрхлэлтийн семинар\" шаардлагатай (гадаад болон шилжих оюутнуудад чөлөөтэй)"
        }
      },
      {
        "icon": "⚠️",
        "title": {
          "KO": "2023년 이전 입학생 주의",
          "EN": "Note for Pre-2024 Entrants",
          "ZH": "2023 年以前入学生注意",
          "VI": "Lưu ý cho sinh viên nhập học trước 2024",
          "UZ": "2023-yilgacha qabul qilingan talabalar uchun eslatmalar",
          "MN": "2023 оноос өмнө элссэн оюутнуудын тэмдэглэл"
        },
        "content": {
          "KO": "2023학년도 이전 입학생은 \"교육과정개편에 따른 경과조치\"를 별도로 확인해야 합니다.\n\n일반편입학생: 배분이수교과 영역 구분 없이 9학점 이상 취득 시 배분이수영역 이수로 인정.",
          "EN": "Students who entered before the 2023 academic year must separately check the \"Transitional Measures Following the Curriculum Reform.\"\n\nGeneral transfer students: earning 9+ credits in distribution courses (regardless of area) counts as fulfilling the distribution requirement.",
          "ZH": "2023 学年以前入学的学生，需另行确认\"课程改编后的过渡措施\"。\n\n普通插班生：不区分分配修读领域，只要修得 9 学分以上，即视为完成分配修读领域。",
          "VI": "Sinh viên nhập học trước năm học 2023 phải kiểm tra riêng \"Biện pháp chuyển tiếp theo cải cách chương trình đào tạo\".\n\nSinh viên chuyển tiếp thông thường: không phân biệt lĩnh vực môn phân bổ, chỉ cần đạt từ 9 tín chỉ trở lên là được công nhận hoàn thành phần phân bổ.",
          "UZ": "2023 o'quv yilidan oldin qabul qilingan talabalar alohida \"O'quv dasturini isloh qilish sababli o'tish choralari\"ni tekshirishlari kerak.\n\nUmumiy transfer talabalari: Qaysi fan ajratilgan bo'lishidan qat'i nazar, 9 yoki undan ko'p kredit olish belgilangan bajarilgan sohalarni tugatish hisoblanadi.",
          "MN": "2023 оны хичээлийн жилээс өмнө элссэн оюутнууд \"Хөтөлбөрийн шинэчлэлээс үүдэлтэй шилжилтийн арга хэмжээ\"-г тусад нь шалгах ёстой.\n\nЕрөнхий шилжих оюутнууд: Хичээлийн чиглэлээр томилогдсон ч 9 ба түүнээс дээш кредит авсан нь томилогдсон дууссан хэсгүүдийг дуусгасан гэж тооцогдоно."
        }
      }
    ]
  }
];
