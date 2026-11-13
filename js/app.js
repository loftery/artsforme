async function uploadImageToCloud(fileId, dataUrl) {
  if (!supabase) {
    console.warn('Supabase не инициализирован, картинка останется локальной');
    return null;
  }
  try {
    // Преобразуем dataURL в Blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    const fileName = `${fileId}.jpg`;

    const { data, error } = await supabase.storage
      .from('artworks')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Ошибка загрузки в Storage:', error);
      // Если ошибка "Bucket not found" или "row-level security", покажем пользователю
      if (error.message.includes('row-level security') || error.message.includes('Bucket not found')) {
        APP.showToast('Ошибка прав в Supabase. Проверь политики Storage.');
      }
      return null;
    }

    // Получаем публичную ссылку
    const { data: publicUrlData } = supabase.storage
      .from('artworks')
      .getPublicUrl(fileName);

    console.log('Картинка загружена:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;

  } catch (e) {
    console.error('Критическая ошибка при загрузке картинки:', e);
    return null;
  }
}
