export function parseMimeType(mimeType: string): string {
  const mimeToFileType: { [key: string]: string } = {
      // Text formats
      'text/html': 'HTML',
      'text/css': 'CSS',
      'text/xml': 'XML',
      'text/csv': 'CSV',
      'text/plain': 'TXT',
      'text/markdown': 'MD',
      
      // Application formats
      'application/javascript': 'JS',
      'application/json': 'JSON',
      'application/xml': 'XML',
      'application/zip': 'ZIP',
      'application/pdf': 'PDF',
      'application/sql': 'SQL',
      'application/graphql': 'GRAPHQL',
      'application/ld+json': 'JSONLD',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'application/vnd.ms-powerpoint': 'PPT',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
      
      // Image formats
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'image/webp': 'WEBP',
      'image/tiff': 'TIFF',
      'image/svg+xml': 'SVG',
      
      // Audio formats
      'audio/midi': 'MIDI',
      'audio/mpeg': 'MP3',
      'audio/webm': 'WEBM',
      'audio/ogg': 'OGG',
      'audio/wav': 'WAV',
      
      // Video formats
      'video/webm': 'WEBM',
      'video/ogg': 'OGV',
      'video/mp4': 'MP4',
  };

  return mimeToFileType[mimeType] || 'UNKNOWN';
}