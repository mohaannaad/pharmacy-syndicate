import { CalendarDays, MapPin, Users, Clock } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { prisma } from "../../lib/prisma";

const CATEGORY_LABELS: Record<string, string> = {
  TRIP: "رحلة",
  COURSE: "كورس تدريبي",
  EVENT: "فعالية",
  RAMADAN_IFTAR: "إفطار رمضان",
  RAMADAN_SUHOOR: "سحور رمضان",
  OTHER: "نشاط آخر",
};

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });

  return (
    <main>
      <PageHeader title="الرحلات والكورسات والفعاليات" subtitle="تصفح الأنشطة المتاحة واحجز مكانك" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-7xl mx-auto px-6">
          {activities.length === 0 ? (
            <p className="text-center text-gray-400 py-10">لا توجد أنشطة متاحة حاليًا</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => {
                const deadlinePassed = new Date(activity.bookingDeadline) < new Date();
                return (
                  <div key={activity.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="relative aspect-video bg-gray-100">
                      {activity.imageUrl ? (
                        <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <CalendarDays className="w-10 h-10" />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 bg-white/90 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                        {CATEGORY_LABELS[activity.category]}
                      </span>
                    </div>

                    <div className="p-5 text-right">
                      <h3 className="font-bold text-gray-900">{activity.title}</h3>
                      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{activity.description}</p>

                      <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
                          {new Date(activity.date).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          {activity.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                          {activity.capacity} مكان متاح
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          آخر موعد للحجز: {new Date(activity.bookingDeadline).toLocaleDateString("ar-EG")}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="font-bold text-primary">
                          {activity.price === 0 ? "مجاني" : `${activity.price} جنيه`}
                        </span>
                        <button
                          disabled
                          title="الحجز يتطلب تسجيل الدخول، هذه الميزة قيد التفعيل قريبًا"
                          className="bg-gray-200 text-gray-400 px-4 py-2 rounded-pill text-sm font-medium cursor-not-allowed"
                        >
                          {deadlinePassed ? "انتهى الحجز" : "احجز الآن"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}