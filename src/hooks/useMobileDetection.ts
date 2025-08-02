import { useState, useEffect } from 'react';

export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      'mobile',
      'android',
      'iphone',
      'ipad',
      'ipod',
      'blackberry',
      'opera mini',
    ];
    const isMobileUserAgent = mobileKeywords.some((keyword) =>
      userAgent.includes(keyword)
    );

    setIsMobile(isMobileUserAgent);
  }, []);

  return isMobile;
}
