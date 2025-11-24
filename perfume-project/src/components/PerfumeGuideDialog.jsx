import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const steps = [
  {
    title: "Malzemeleri Hazırlama",
    content: "Gerekli malzemeler:\n- Parfüm esansı\n- Saf alkol (%96-99)\n- Saf su\n- Beher veya ölçü kabı\n- Cam şişe\n- Pipet veya damlalık\n- Karıştırıcı\n- Huni",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Güvenlik Önlemleri",
    content: "- İyi havalandırılmış bir ortamda çalışın\n- Eldiven ve maske kullanın\n- Direkt güneş ışığından uzak durun\n- Çocuklardan uzak tutun",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Karışım Hazırlama",
    content: "1. Önce esansı ölçün ve şişeye ekleyin\n2. Üzerine alkolü ekleyin\n3. Son olarak suyu ekleyin\n4. Yavaşça karıştırın",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Dinlendirme",
    content: "- Karışımı serin ve karanlık bir yerde dinlendirin\n- En az 1-2 hafta bekletin\n- Ara sıra hafifçe çalkalayın",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Test Etme",
    content: "- Dinlenme süresi sonunda parfümü test edin\n- Koku dengesi için birkaç gün daha bekletebilirsiniz\n- Beğendiğiniz kıvama gelince kullanmaya başlayabilirsiniz",
    image: "https://images.unsplash.com/photo-1583445095369-9c651e7e5d34?q=80&w=800&auto=format&fit=crop"
  }
];

export function PerfumeGuideDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 dark:text-gray-100">
            Evde Parfüm Nasıl Yapılır?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">            
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded dark:bg-yellow-900/20 dark:border-yellow-600">
            <p className="text-yellow-700 dark:text-yellow-500">
              <strong>Önemli Not:</strong> Bu kılavuz genel bilgi amaçlıdır. 
              Her parfüm formülü farklı olabilir. Sitemizdeki formülleri takip ederek 
              daha kesin sonuçlar elde edebilirsiniz.
            </p>
          </div>
          {steps.map((step, index) => (
            <div key={index} className="border rounded-lg p-6 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center dark:text-gray-100">
                <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 dark:bg-gray-700">
                  {index + 1}
                </span>
                {step.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="whitespace-pre-line text-gray-600 dark:text-gray-300">
                  {step.content}
                </div>
                {step.image && (
                  <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-700">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}          
        </div>
      </DialogContent>
    </Dialog>
  );
} 