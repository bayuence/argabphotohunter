import React, { useState } from 'react';
import { Send, AlertCircle, Calendar, Link as LinkIcon, DollarSign } from 'lucide-react';
import { SERVICES } from '../data/services';

const WHATSAPP_DESTINATION = '6283185827551';

export default function OrderForm({ selectedService }) {
  const currentServiceObj = SERVICES.find((s) => s.id === selectedService) || SERVICES[0];

  // Batas tanggal minimum hari ini
  const todayDate = new Date().toISOString().split('T')[0];
  const todayDateTime = new Date().toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    // 01 / Identitas pemesan
    name: '',
    contact: '',
    business: '',
    social: '',

    // 02 / Detail pesanan
    title: '',
    quantity: '',
    budget: '',
    deadline: '',

    // 03 / Spesifikasi Graphic Design
    designType: '',
    size: '',
    orientation: '',
    style: '',
    mainColor: '',
    secondColor: '',
    elements: '',
    copyText: '',

    // 03 / Kebutuhan Photography
    photoType: '',
    photoDate: '',
    photoLocation: '',
    photoDuration: '',
    photoConcept: '',

    // 03 / Kebutuhan Videography
    videoType: '',
    videoDate: '',
    videoLocation: '',
    videoDuration: '',
    videoConcept: '',

    // 03 / Kebutuhan UMKM Bundling
    brandName: '',
    businessType: '',
    products: '',
    brandColor: '',
    bundleNeeds: '',

    // 04 / File dan referensi pendukung
    files: '',
    reference: '',
    notes: '',

    agree: false,
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Validasi seluruh aturan field
  const validateField = (name, value) => {
    let error = null;

    if (name === 'name') {
      if (!value.trim()) {
        error = 'Nama pemesan wajib diisi.';
      } else if (value.trim().length < 3) {
        error = 'Nama pemesan minimal 3 karakter huruf.';
      } else if (!/^[a-zA-Z\s'.]+$/.test(value.trim())) {
        error = 'Nama pemesan hanya boleh berupa huruf alfabet.';
      }
    }

    if (name === 'contact') {
      const clean = value.replace(/\s+/g, '');
      if (!clean) {
        error = 'Nomor WhatsApp wajib diisi.';
      } else if (!/^(\+?62|08)[0-9]{8,13}$/.test(clean)) {
        error = 'Nomor tidak valid. Gunakan awalan 08 atau 62 (contoh: 081234567890).';
      }
    }

    if (name === 'title') {
      if (!value.trim()) {
        error = 'Nama atau judul pesanan wajib diisi.';
      } else if (value.trim().length < 3) {
        error = 'Judul pesanan minimal 3 karakter.';
      }
    }

    if (name === 'deadline' && value) {
      if (value < todayDate) {
        error = 'Tanggal deadline tidak boleh di masa lampau.';
      }
    }

    if ((name === 'photoDate' || name === 'videoDate') && value) {
      if (value < todayDateTime) {
        error = 'Jadwal waktu tidak boleh di masa lampau.';
      }
    }

    if (name === 'reference' && value.trim()) {
      if (!/^https?:\/\/.+/i.test(value.trim())) {
        error = 'Link referensi harus diawali http:// atau https://';
      }
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // ATURAN 1: NOMOR WHATSAPP (Hanya angka dan tanda +)
    if (name === 'contact') {
      const sanitized = value.replace(/[^\d+]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, sanitized) }));
      }
      return;
    }

    // ATURAN 2: BUDGET (Otomatis format mata uang Rupiah)
    if (name === 'budget') {
      const numericOnly = value.replace(/\D/g, '');
      const formatted = numericOnly 
        ? 'Rp ' + new Intl.NumberFormat('id-ID').format(numericOnly) 
        : '';
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    // ATURAN 3: INSTAGRAM (Otomatis sertakan @ dan filter karakter username)
    if (name === 'social') {
      let clean = value.replace(/[^@a-zA-Z0-9._]/g, '');
      if (clean && !clean.startsWith('@')) {
        clean = '@' + clean;
      }
      setFormData((prev) => ({ ...prev, [name]: clean }));
      return;
    }

    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tandai semua field yang wajib dicek
    const newTouched = {
      name: true,
      contact: true,
      title: true,
      deadline: true,
      photoDate: true,
      videoDate: true,
      reference: true,
      agree: true,
    };
    setTouched(newTouched);

    const newErrors = {
      name: validateField('name', formData.name),
      contact: validateField('contact', formData.contact),
      title: validateField('title', formData.title),
      deadline: validateField('deadline', formData.deadline),
      reference: validateField('reference', formData.reference),
    };

    if (selectedService === 'photo') {
      newErrors.photoDate = validateField('photoDate', formData.photoDate);
    } else if (selectedService === 'video') {
      newErrors.videoDate = validateField('videoDate', formData.videoDate);
    }

    if (!formData.agree) {
      newErrors.agree = 'Harap centang persetujuan sebelum mengirim formulir.';
    }

    // Bersihkan nulls
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Harap periksa kembali isian formulir. Ada data yang belum sesuai aturan.');
      return;
    }

    // Format tanggal ramah baca untuk WA
    const formatDisplayDate = (d) => {
      if (!d) return '-';
      try {
        return new Date(d).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch {
        return d;
      }
    };

    const formatDisplayDateTime = (dt) => {
      if (!dt) return '-';
      try {
        return new Date(dt).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB';
      } catch {
        return dt;
      }
    };

    // Rangkuman Pesan WhatsApp Resmi
    const lines = [
      '✨ *FORMULIR PEMESANAN FOUR DIGITAL STUDIO* ✨',
      '',
      '*LAYANAN DIPILIH*',
      currentServiceObj.title,
      '',
      '*01. IDENTITAS PEMESAN*',
      `Nama: ${formData.name.trim()}`,
      `WhatsApp: ${formData.contact.trim()}`,
      `Instansi/Usaha/Komunitas: ${formData.business.trim() || '-'}`,
      `Instagram: ${formData.social.trim() || '-'}`,
      '',
      '*02. DETAIL PESANAN*',
      `Judul pesanan: ${formData.title.trim()}`,
      `Jumlah: ${formData.quantity.trim() || '-'}`,
      `Budget: ${formData.budget.trim() || '-'}`,
      `Deadline: ${formatDisplayDate(formData.deadline)}`,
      '',
      '*03. SPESIFIKASI LAYANAN*',
    ];

    if (selectedService === 'design') {
      lines.push(
        `Jenis desain: ${formData.designType.trim() || '-'}`,
        `Ukuran desain: ${formData.size.trim() || '-'}`,
        `Orientasi: ${formData.orientation || '-'}`,
        `Tema/gaya: ${formData.style.trim() || '-'}`,
        `Warna utama: ${formData.mainColor.trim() || '-'}`,
        `Warna pendukung: ${formData.secondColor.trim() || '-'}`,
        `Elemen tambahan: ${formData.elements.trim() || '-'}`,
        `Tulisan wajib: ${formData.copyText.trim() || '-'}`
      );
    } else if (selectedService === 'photo') {
      lines.push(
        `Jenis fotografi: ${formData.photoType.trim() || '-'}`,
        `Tanggal dan waktu sesi: ${formatDisplayDateTime(formData.photoDate)}`,
        `Lokasi: ${formData.photoLocation.trim() || '-'}`,
        `Durasi sesi: ${formData.photoDuration.trim() || '-'}`,
        `Konsep foto: ${formData.photoConcept.trim() || '-'}`
      );
    } else if (selectedService === 'video') {
      lines.push(
        `Jenis video: ${formData.videoType.trim() || '-'}`,
        `Tanggal dan waktu produksi: ${formatDisplayDateTime(formData.videoDate)}`,
        `Lokasi: ${formData.videoLocation.trim() || '-'}`,
        `Target durasi: ${formData.videoDuration.trim() || '-'}`,
        `Konsep/alur video: ${formData.videoConcept.trim() || '-'}`
      );
    } else if (selectedService === 'umkm') {
      lines.push(
        `Nama usaha/brand: ${formData.brandName.trim() || '-'}`,
        `Bidang usaha: ${formData.businessType.trim() || '-'}`,
        `Produk/layanan: ${formData.products.trim() || '-'}`,
        `Warna identitas: ${formData.brandColor.trim() || '-'}`,
        `Materi bundling: ${formData.bundleNeeds.trim() || '-'}`
      );
    }

    lines.push(
      '',
      '*04. FILE & REFERENSI*',
      `File yang akan dikirim: ${formData.files.trim() || '-'}`,
      `Link referensi: ${formData.reference.trim() || '-'}`,
      `Catatan khusus: ${formData.notes.trim() || '-'}`,
      '',
      'Mohon konfirmasi rincian pesanan dan harga. Terima kasih.'
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_DESTINATION}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <form
      id="orderForm"
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#15171a]/95 border border-[#30343a] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
        Formulir Pemesanan
      </h2>
      <p className="text-xs sm:text-sm text-slate-400 mb-6">
        Mohon isi informasi berikut dengan lengkap agar kami dapat menyiapkan penawaran yang sesuai.
      </p>

      {/* 01 / Identitas pemesan */}
      <div className="text-xs font-semibold tracking-wider text-gold-light uppercase mb-3">
        01 / Identitas pemesan
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Nama pemesan <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nama lengkap"
            className={`w-full bg-[#0e1012] border rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none transition ${
              errors.name && touched.name
                ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/50'
                : 'border-[#353a40] focus:border-gold'
            }`}
          />
          {errors.name && touched.name && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Nomor WhatsApp <span className="text-red-400">*</span>
          </label>
          <input
            id="contact"
            name="contact"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            value={formData.contact}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="08xxxxxxxxxx"
            className={`w-full bg-[#0e1012] border rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none transition ${
              errors.contact && touched.contact
                ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/50'
                : 'border-[#353a40] focus:border-gold'
            }`}
          />
          {errors.contact && touched.contact && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.contact}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="business" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Instansi / usaha / komunitas
          </label>
          <input
            id="business"
            name="business"
            type="text"
            value={formData.business}
            onChange={handleChange}
            placeholder="Nama instansi (jika ada)"
            className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="social" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Instagram (opsional)
          </label>
          <input
            id="social"
            name="social"
            type="text"
            value={formData.social}
            onChange={handleChange}
            placeholder="@username"
            className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="h-px bg-[#30343a] my-6"></div>

      {/* 02 / Detail pesanan */}
      <div className="text-xs font-semibold tracking-wider text-gold-light uppercase mb-3">
        02 / Detail pesanan
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Nama atau judul pesanan <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Contoh: Poster Grand Opening"
            className={`w-full bg-[#0e1012] border rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none transition ${
              errors.title && touched.title
                ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/50'
                : 'border-[#353a40] focus:border-gold'
            }`}
          />
          {errors.title && touched.title && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Jumlah pesanan
          </label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Contoh: 2 desain / 1 sesi"
            className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Budget yang disiapkan <span className="text-slate-500 font-normal">(format otomatis angka)</span>
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            inputMode="numeric"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Contoh: Rp 300.000"
            className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Deadline / tanggal kebutuhan
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            min={todayDate}
            value={formData.deadline}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-[#0e1012] border rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition [color-scheme:dark] ${
              errors.deadline && touched.deadline
                ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/50'
                : 'border-[#353a40] focus:border-gold'
            }`}
          />
          {errors.deadline && touched.deadline && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.deadline}</span>
            </p>
          )}
        </div>
      </div>

      <div className="h-px bg-[#30343a] my-6"></div>

      {/* 03 / Spesifikasi layanan dinamis */}
      {selectedService === 'design' && (
        <div id="designFields" className="mb-6">
          <div className="text-xs font-semibold tracking-wider text-gold-light uppercase mb-3">
            03 / Spesifikasi graphic design
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="designType" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Jenis desain</label>
              <input
                id="designType"
                name="designType"
                type="text"
                value={formData.designType}
                onChange={handleChange}
                placeholder="Poster, logo, feed, banner, jersey, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="size" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Ukuran desain</label>
              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                placeholder="A4, 1080 × 1350 px, custom, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="orientation" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Orientasi</label>
              <select
                id="orientation"
                name="orientation"
                value={formData.orientation}
                onChange={handleChange}
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-gold"
              >
                <option value="">Pilih orientasi</option>
                <option value="Portrait">Portrait</option>
                <option value="Landscape">Landscape</option>
                <option value="Square">Square</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label htmlFor="style" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Tema / gaya desain</label>
              <input
                id="style"
                name="style"
                type="text"
                value={formData.style}
                onChange={handleChange}
                placeholder="Minimalis, elegan, modern, sporty, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="mainColor" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Warna utama</label>
              <input
                id="mainColor"
                name="mainColor"
                type="text"
                value={formData.mainColor}
                onChange={handleChange}
                placeholder="Contoh: Hitam"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="secondColor" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Warna pendukung</label>
              <input
                id="secondColor"
                name="secondColor"
                type="text"
                value={formData.secondColor}
                onChange={handleChange}
                placeholder="Contoh: Emas dan putih"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="elements" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Elemen yang ingin ditambahkan</label>
              <textarea
                id="elements"
                name="elements"
                rows="3"
                value={formData.elements}
                onChange={handleChange}
                placeholder="Logo, foto, ikon, ilustrasi, QR Code, ornamen, watermark, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold resize-y"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="copyText" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Tulisan / informasi yang wajib dicantumkan</label>
              <textarea
                id="copyText"
                name="copyText"
                rows="3"
                value={formData.copyText}
                onChange={handleChange}
                placeholder="Judul, tanggal, lokasi, kontak, slogan, dan teks lainnya"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold resize-y"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {selectedService === 'photo' && (
        <div id="photoFields" className="mb-6">
          <div className="text-xs font-semibold tracking-wider text-gold-light uppercase mb-3">
            03 / Kebutuhan photography
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="photoType" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Jenis fotografi</label>
              <input
                id="photoType"
                name="photoType"
                type="text"
                value={formData.photoType}
                onChange={handleChange}
                placeholder="Acara, produk, personal, komunitas, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="photoDate" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Tanggal dan waktu sesi</label>
              <input
                id="photoDate"
                name="photoDate"
                type="datetime-local"
                min={todayDateTime}
                value={formData.photoDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-[#0e1012] border rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition [color-scheme:dark] ${
                  errors.photoDate && touched.photoDate
                    ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/50'
                    : 'border-[#353a40] focus:border-gold'
                }`}
              />
              {errors.photoDate && touched.photoDate && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.photoDate}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="photoLocation" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Lokasi pemotretan</label>
              <input
                id="photoLocation"
                name="photoLocation"
                type="text"
                value={formData.photoLocation}
                onChange={handleChange}
                placeholder="Alamat / nama tempat"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="photoDuration" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Durasi / kebutuhan sesi</label>
              <input
                id="photoDuration"
                name="photoDuration"
                type="text"
                value={formData.photoDuration}
                onChange={handleChange}
                placeholder="Contoh: 2 jam"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="photoConcept" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Konsep atau hasil foto yang diinginkan</label>
              <textarea
                id="photoConcept"
                name="photoConcept"
                rows="3"
                value={formData.photoConcept}
                onChange={handleChange}
                placeholder="Jelaskan suasana, gaya, jumlah orang/produk, dan kebutuhan khusus"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold resize-y"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {selectedService === 'video' && (
        <div id="videoFields" className="mb-6">
          <div className="text-xs font-semibold tracking-wider text-gold-light uppercase mb-3">
            03 / Kebutuhan videography
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="videoType" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Jenis video</label>
              <input
                id="videoType"
                name="videoType"
                type="text"
                value={formData.videoType}
                onChange={handleChange}
                placeholder="Cinematic, after movie, promosi, profil, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="videoDate" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Tanggal dan waktu produksi</label>
              <input
                id="videoDate"
                name="videoDate"
                type="datetime-local"
                min={todayDateTime}
                value={formData.videoDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-[#0e1012] border rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition [color-scheme:dark] ${
                  errors.videoDate && touched.videoDate
                    ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/50'
                    : 'border-[#353a40] focus:border-gold'
                }`}
              />
              {errors.videoDate && touched.videoDate && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.videoDate}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="videoLocation" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Lokasi produksi</label>
              <input
                id="videoLocation"
                name="videoLocation"
                type="text"
                value={formData.videoLocation}
                onChange={handleChange}
                placeholder="Alamat / nama tempat"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="videoDuration" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Target durasi video</label>
              <input
                id="videoDuration"
                name="videoDuration"
                type="text"
                value={formData.videoDuration}
                onChange={handleChange}
                placeholder="Contoh: 1 menit / 3 menit"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="videoConcept" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Konsep / alur video</label>
              <textarea
                id="videoConcept"
                name="videoConcept"
                rows="3"
                value={formData.videoConcept}
                onChange={handleChange}
                placeholder="Jelaskan ide, suasana, referensi, musik, voice-over, dan kebutuhan khusus"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold resize-y"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {selectedService === 'umkm' && (
        <div id="umkmFields" className="mb-6">
          <div className="text-xs font-semibold tracking-wider text-gold-light uppercase mb-3">
            03 / Kebutuhan UMKM branding bundling
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="brandName" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Nama usaha / brand</label>
              <input
                id="brandName"
                name="brandName"
                type="text"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Nama bisnis Anda"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Bidang usaha</label>
              <input
                id="businessType"
                name="businessType"
                type="text"
                value={formData.businessType}
                onChange={handleChange}
                placeholder="Kuliner, fashion, jasa, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="products" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Produk / layanan utama</label>
              <input
                id="products"
                name="products"
                type="text"
                value={formData.products}
                onChange={handleChange}
                placeholder="Produk yang dijual"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="brandColor" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Warna identitas brand</label>
              <input
                id="brandColor"
                name="brandColor"
                type="text"
                value={formData.brandColor}
                onChange={handleChange}
                placeholder="Jika sudah ada"
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bundleNeeds" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">Materi yang dibutuhkan</label>
              <textarea
                id="bundleNeeds"
                name="bundleNeeds"
                rows="3"
                value={formData.bundleNeeds}
                onChange={handleChange}
                placeholder="Contoh: desain feed Instagram, X-banner, banner gerobak, daftar menu, materi promosi, dll."
                className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold resize-y"
              ></textarea>
            </div>
          </div>
          <div className="bg-[#211e17] border border-[#5c4a2b] text-[#e8d9b8] p-3.5 rounded-xl text-xs">
            Paket bundling UMKM mulai Rp250.000. Rincian isi paket, jumlah desain, ukuran, dan biaya akhir akan dikonfirmasi setelah kebutuhan usaha diperiksa.
          </div>
        </div>
      )}

      <div className="h-px bg-[#30343a] my-6"></div>

      {/* 04 / File dan referensi pendukung */}
      <div className="text-xs font-semibold tracking-wider text-gold-light uppercase mb-3">
        04 / File dan referensi pendukung
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="files" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Daftar file yang akan dikirim
          </label>
          <textarea
            id="files"
            name="files"
            rows="3"
            value={formData.files}
            onChange={handleChange}
            placeholder="Logo (PNG/SVG/AI/CDR), foto, materi tulisan, font, referensi desain, atau file lainnya. File dapat dikirim langsung melalui WhatsApp."
            className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold resize-y"
          ></textarea>
        </div>

        <div>
          <label htmlFor="reference" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Link referensi (opsional) <span className="text-slate-500 font-normal">(harus diawali http:// atau https://)</span>
          </label>
          <input
            id="reference"
            name="reference"
            type="url"
            value={formData.reference}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://drive.google.com/... atau https://pinterest.com/..."
            className={`w-full bg-[#0e1012] border rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none transition ${
              errors.reference && touched.reference
                ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/50'
                : 'border-[#353a40] focus:border-gold'
            }`}
          />
          {errors.reference && touched.reference && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.reference}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-xs font-semibold text-[#d9dadd] mb-1.5">
            Catatan atau permintaan khusus
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tambahkan informasi lain yang perlu kami ketahui"
            className="w-full bg-[#0e1012] border border-[#353a40] rounded-xl px-3.5 py-3 text-sm text-white placeholder-[#737982] focus:outline-none focus:border-gold resize-y"
          ></textarea>
        </div>
      </div>

      {/* Checkline */}
      <div className="mb-6">
        <label className="flex items-start gap-3 text-xs text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            required
            className="mt-0.5 w-4 h-4 rounded accent-gold bg-[#0e1012] border-[#353a40]"
          />
          <span className={errors.agree && touched.agree ? 'text-red-400' : ''}>
            Saya memastikan informasi yang saya isi sudah benar dan bersedia melakukan konfirmasi detail serta harga sebelum pengerjaan dimulai.
          </span>
        </label>
        {errors.agree && touched.agree && (
          <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.agree}</span>
          </p>
        )}
      </div>

      {/* Submit Button (Tanpa teks berulang di bawahnya) */}
      <button
        type="submit"
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#b9914d] to-[#efd99e] hover:brightness-105 active:brightness-95 text-[#17130c] font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg transition duration-150 cursor-pointer"
      >
        <span>Kirim Formulir via WhatsApp ↗</span>
      </button>
    </form>
  );
}
