import { MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';

export const contactOptions = [
    {
        icon: MessageCircle,
        title: "Live Chat PAYLOCITY",
        desc: "Tanyakan sekarang melalui Live Chat!",
        schedule: "Senin - Jumat : 09:00 - 18:00 WIB",
        action: "Chat Sekarang",
        color: "bg-emerald-500",
    },
    {
        icon: Phone,
        title: "Call Center PAYLOCITY",
        desc: "Diskusikan langsung dengan tim PAYLOCITY!",
        schedule: "Senin - Jumat : 09:00 - 18:00 WIB",
        action: "087100008888",
        color: "bg-blue-500",
    },
    {
        icon: Mail,
        title: "Email PAYLOCITY",
        desc: "Butuh inquiry lebih detail? Kirim email Anda ke PAYLOCITY!",
        action: "paylocity@co.com",
        color: "bg-orange-500",
    },
    {
        icon: HelpCircle,
        title: "PAYLOCITY Help Center",
        desc: "Lebih dari 400+ artikel FAQ untuk membantu menjawab pertanyaan Anda.",
        action: "Lihat Help Center",
        color: "bg-purple-500",
    },
];