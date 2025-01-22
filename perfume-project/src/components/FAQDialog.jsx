import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const FAQDialog = ({ open, onOpenChange }) => {
  const faqs = [
    {
      question: "Parfüm formülü nasıl hesaplanır?",
      answer: (
        <div className="space-y-4">
          <p>Bunun iki farklı yolu mevcuttur:</p>
          
          <div className="space-y-2">
            <p>1. Gram hesabı yapabilirsiniz</p>
            <p>2. ML cinsinden ölçü kabı kullanabilirsiniz</p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Elinizde hassas terazi var ise, bilinmesi gereken yoğunluk değerleri:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Etil alkol: 0,789 g/ml</li>
              <li>Saf su: 1 g/ml</li>
              <li>Esans: ~0,95 g/ml</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Örnek Hesaplama:</p>
            <p>100ml parfüm için (%25 esans, %5 saf su, %70 alkol):</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Su: 100ml × %5 = 5ml (5g)</li>
              <li>Alkol: 100ml × %70 = 70ml (55,23g)</li>
              <li>Esans: 100ml × %25 = 25ml (23,75g)</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Not:</span> Eğer elinizde hassas terazi yoksa ve ml hesabı ile yapmak isterseniz, 
              bir şırınga veya ml cinsinden ölçü kabı kullanarak da parfümünüzü hazırlayabilirsiniz.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "Parfümde saf su neden kullanılır?",
      answer: (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Saf suyun parfümdeki rolü:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Alkol derecesini düşürmek için kullanılır
                <p className="text-sm text-muted-foreground mt-1">
                  Yüksek dereceli alkol tene sıkılan parfümlerde kuruluk yaratabilir
                </p>
              </li>
              <li>
                Kalıcılığı etkiler
                <p className="text-sm text-muted-foreground mt-1">
                  Alkol uçucu bir madde olduğu için parfümün kalıcılığını etkileyecektir
                </p>
              </li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Önemli Not:</span> Saf su parfüm yapımında en son eklenir. 
              Dinlenme süresinin sonunda test edip ekleme yapabilirsiniz.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "Favorilere eklediğim parfümleri nerede görebilirim?",
      answer: "Favorilere eklediğiniz parfümleri görmek için üye girişi yaptıktan sonra, sağ üst köşedeki profil menüsünden 'Favorilerim' seçeneğine tıklayabilirsiniz. Bu sayfada favori parfümlerinizi görüntüleyebilir, düzenleyebilir veya favorilerden çıkarabilirsiniz."
    },
    {
      question: "Nereden alkol temin edebilirim?",
      answer: (
        <div className="space-y-4">
          <p>Türkiye'de etil alkolün satışı kısıtlıdır ve yalnızca izinli satıcılardan temin edilebilir:</p>
          
          <div className="space-y-2">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Eczaneler:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Formülasyon için gerekli küçük miktarlarda etil alkol satabilirler. Reçete veya kullanım amacı beyanı gerekebilir.
                </p>
              </li>
              <li>
                <span className="font-medium">Ecza depoları:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Genellikle işletmeler ve ruhsatlı alıcılar için toptan satış yaparlar.
                </p>
              </li>
              <li>
                <span className="font-medium">Kimyasal tedarikçiler:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Ruhsatlı işletmelere satış yapan tedarikçilerdir.
                </p>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Önemli noktalar:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Satın alırken kullanım amacınızı belirtmeniz gerekebilir</li>
              <li>Yasal sınırlamalara dikkat edilmelidir</li>
              <li>Ruhsatsız satıcılardan alınmamalıdır</li>
              <li>Alkolün saflık derecesi önemlidir (%96-99.9 arası tercih edilir)</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Alternatif:</span> Parfüm yapımı için parfümcülük malzemeleri satan özel mağazalarda bulunan 
              "perfumers alcohol" veya "parfüm bazı" ürünlerini de kullanabilirsiniz. Bu ürünler parfüm yapımı için özel olarak 
              formüle edilmiştir ve kullanımı daha kolaydır.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Sıkça Sorulan Sorular
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQDialog; 