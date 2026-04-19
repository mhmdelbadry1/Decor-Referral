import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية — مستشار الديكور',
  description:
    'سياسة الخصوصية الخاصة بمنصة مستشار الديكور — توضح كيفية جمع بياناتك الشخصية واستخدامها وحمايتها.',
}

const LAST_UPDATED = '١ يناير ٢٠٢٥'
const CONTACT_EMAIL = 'modi432116@gmail.com'
const CONTACT_WHATSAPP = 'https://wa.me/966542197220'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">

      {/* ── Header ───────────────────────────────────────── */}
      <header className="border-b border-line px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-[0.83rem] text-ink-faint hover:text-accent transition-colors duration-200 mb-6 inline-block"
          >
            → العودة للرئيسية
          </Link>
          <h1
            className="font-display font-bold text-ink"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)' }}
          >
            سياسة الخصوصية
          </h1>
          <p className="text-ink-faint text-sm mt-2">
            آخر تحديث: {LAST_UPDATED}
          </p>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────── */}
      <main className="px-6 py-14">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Intro */}
          <Section>
            <p className="text-ink-dim leading-relaxed">
              تحكم سياسة الخصوصية هذه طريقة جمع منصة <strong className="text-ink">مستشار الديكور</strong> لبياناتك الشخصية واستخدامها وحمايتها عند استخدامك موقعنا الإلكتروني أو تواصلك معنا. نحن ملتزمون بحماية خصوصيتك وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية.
            </p>
          </Section>

          {/* 1 */}
          <Section title="١. البيانات التي نجمعها">
            <p className="text-ink-dim leading-relaxed mb-4">
              عند تعبئة نموذج الاستشارة أو التواصل معنا، قد نجمع البيانات التالية:
            </p>
            <ul className="space-y-2 text-ink-dim">
              <ListItem>الاسم الكامل</ListItem>
              <ListItem>رقم الجوال</ListItem>
              <ListItem>المدينة</ListItem>
              <ListItem>نوع الخدمة المطلوبة (مثل: أرضيات، دهانات، أثاث، إلخ)</ListItem>
              <ListItem>الميزانية التقريعية للمشروع</ListItem>
              <ListItem>بيانات التصفح التلقائية (عنوان IP، نوع المتصفح، الصفحات المُزارة) عبر أدوات التحليل</ListItem>
            </ul>
          </Section>

          {/* 2 */}
          <Section title="٢. كيف نستخدم بياناتك">
            <p className="text-ink-dim leading-relaxed mb-4">
              نستخدم بياناتك الشخصية للأغراض التالية حصراً:
            </p>
            <ul className="space-y-2 text-ink-dim">
              <ListItem>التواصل معك لتأكيد طلب الاستشارة وتحديد احتياجاتك</ListItem>
              <ListItem>ترشيح شركات التشطيب المناسبة لمدينتك وخدمتك وميزانيتك</ListItem>
              <ListItem>تحسين جودة الخدمة المقدمة وتطوير المنصة</ListItem>
              <ListItem>إرسال تحديثات تتعلق بطلبك (عبر واتساب فقط، دون إرسال إعلانات غير مرغوب بها)</ListItem>
            </ul>
          </Section>

          {/* 3 */}
          <Section title="٣. مشاركة البيانات مع الغير">
            <p className="text-ink-dim leading-relaxed mb-4">
              نحن <strong className="text-ink">لا نبيع بياناتك</strong> لأي جهة. قد نشارك بياناتك في الحالات التالية فقط:
            </p>
            <ul className="space-y-2 text-ink-dim">
              <ListItem>
                <strong className="text-ink">شركات التشطيب الشريكة:</strong> نشارك بيانات التواصل الخاصة بك مع الشركة المرشحة لك فقط، وذلك لتقديم عروض الأسعار والمتابعة.
              </ListItem>
              <ListItem>
                <strong className="text-ink">مزودو الخدمات التقنية:</strong> نستخدم خدمات سحابية موثوقة (مثل Supabase) لتخزين البيانات بأمان، وهي ملزمة بالحفاظ على سريتها.
              </ListItem>
              <ListItem>
                <strong className="text-ink">منصات التحليل والإعلان:</strong> قد نستخدم أدوات مثل Meta Pixel (فيسبوك/إنستغرام) لقياس أداء الإعلانات وتحسينها. هذه الأدوات قد تجمع بيانات مجهولة الهوية عن سلوك التصفح.
              </ListItem>
              <ListItem>
                <strong className="text-ink">الجهات القانونية:</strong> عند الاقتضاء القانوني بموجب نظام سعودي أو أمر قضائي.
              </ListItem>
            </ul>
          </Section>

          {/* 4 */}
          <Section title="٤. ملفات تعريف الارتباط (Cookies)">
            <p className="text-ink-dim leading-relaxed">
              قد يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة التصفح وقياس أداء الصفحات. يمكنك التحكم في هذه الملفات عبر إعدادات متصفحك. علماً بأن تعطيلها قد يؤثر على بعض وظائف الموقع.
            </p>
          </Section>

          {/* 5 */}
          <Section title="٥. أمان البيانات">
            <p className="text-ink-dim leading-relaxed">
              نطبق تدابير أمنية تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الحذف. يشمل ذلك تشفير البيانات أثناء النقل (HTTPS) وتخزينها على خوادم آمنة.
            </p>
          </Section>

          {/* 6 */}
          <Section title="٦. مدة الاحتفاظ بالبيانات">
            <p className="text-ink-dim leading-relaxed">
              نحتفظ ببياناتك الشخصية طالما كانت ضرورية لتقديم الخدمة أو لمدة لا تتجاوز ثلاث (٣) سنوات من آخر تعامل. بعدها، يتم حذفها أو إخفاء هويتها بشكل آمن.
            </p>
          </Section>

          {/* 7 */}
          <Section title="٧. حقوقك">
            <p className="text-ink-dim leading-relaxed mb-4">
              وفقاً لنظام حماية البيانات الشخصية السعودي، يحق لك:
            </p>
            <ul className="space-y-2 text-ink-dim">
              <ListItem>الاطلاع على بياناتك الشخصية المحفوظة لدينا</ListItem>
              <ListItem>طلب تصحيح أي بيانات غير دقيقة</ListItem>
              <ListItem>طلب حذف بياناتك (مع مراعاة الالتزامات القانونية)</ListItem>
              <ListItem>سحب موافقتك على معالجة بياناتك في أي وقت</ListItem>
              <ListItem>تقديم شكوى للجهات المختصة في حال انتهاك خصوصيتك</ListItem>
            </ul>
            <p className="text-ink-dim leading-relaxed mt-4">
              لممارسة أي من هذه الحقوق، تواصل معنا عبر البريد الإلكتروني أو واتساب أدناه.
            </p>
          </Section>

          {/* 8 */}
          <Section title="٨. روابط خارجية">
            <p className="text-ink-dim leading-relaxed">
              قد يحتوي موقعنا على روابط لمواقع خارجية (مثل إنستغرام، تيك توك). لسنا مسؤولين عن سياسات الخصوصية الخاصة بهذه المواقع ونوصيك بمراجعتها بشكل مستقل.
            </p>
          </Section>

          {/* 9 */}
          <Section title="٩. تعديلات على هذه السياسة">
            <p className="text-ink-dim leading-relaxed">
              قد نُحدّث هذه السياسة من وقت لآخر. سيُشار إلى تاريخ آخر تحديث في أعلى الصفحة. نشجعك على مراجعتها دورياً. استمرارك في استخدام الموقع بعد أي تعديل يُعدّ قبولاً للسياسة المُحدّثة.
            </p>
          </Section>

          {/* Contact */}
          <section className="bg-surface border border-line rounded-2xl p-8">
            <h2 className="font-display font-bold text-ink text-xl mb-4">
              ١٠. التواصل معنا
            </h2>
            <p className="text-ink-dim leading-relaxed mb-6">
              لأي استفسار يتعلق بهذه السياسة أو بياناتك الشخصية، يمكنك التواصل معنا عبر:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="
                  flex-1 text-center py-3 px-5 rounded-xl
                  bg-bg border border-line text-ink-dim text-sm
                  hover:border-accent hover:text-accent
                  transition-all duration-200
                "
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={CONTACT_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-1 text-center py-3 px-5 rounded-xl
                  bg-accent text-bg text-sm font-bold
                  hover:bg-accent-hover
                  transition-all duration-200
                "
              >
                تواصل عبر واتساب
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* ── Simple footer ────────────────────────────────── */}
      <footer className="border-t border-line px-6 py-8 text-center">
        <p className="text-[0.7rem] text-ink-faint tracking-widest uppercase">
          © 2025 مستشار الديكور · جميع الحقوق محفوظة
        </p>
      </footer>

    </div>
  )
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      {title && (
        <h2 className="font-display font-bold text-ink text-xl border-b border-line pb-3">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

function ListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="text-accent mt-1 shrink-0">◈</span>
      <span className="leading-relaxed">{children}</span>
    </li>
  )
}
