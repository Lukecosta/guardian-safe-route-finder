export class SocialMediaService {
  static shareOnFacebook(message: string, latitude?: number, longitude?: number) {
    const locationText = latitude && longitude 
      ? ` I'm currently at coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : '';
    
    const fullMessage = encodeURIComponent(message + locationText);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${fullMessage}`;
    
    window.open(url, '_blank', 'width=600,height=400');
  }

  static shareOnTwitter(message: string, latitude?: number, longitude?: number) {
    const locationText = latitude && longitude 
      ? ` 📍 Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : '';
    
    const fullMessage = encodeURIComponent(message + locationText);
    const url = `https://twitter.com/intent/tweet?text=${fullMessage}`;
    
    window.open(url, '_blank', 'width=600,height=400');
  }

  static async shareLocation(platform: string, coordinates: GeolocationCoordinates) {
    const baseMessage = `🛡️ Safety Check-in: I'm safe and using Guardian app to stay protected! #StaySafe #Guardian`;
    
    const { latitude, longitude } = coordinates;
    
    switch (platform) {
      case 'facebook':
        this.shareOnFacebook(baseMessage, latitude, longitude);
        break;
      case 'twitter':
        this.shareOnTwitter(baseMessage, latitude, longitude);
        break;
      case 'both':
        this.shareOnFacebook(baseMessage, latitude, longitude);
        setTimeout(() => {
          this.shareOnTwitter(baseMessage, latitude, longitude);
        }, 1000);
        break;
      default:
        throw new Error('Unsupported platform');
    }
  }

  static shareGeneralMessage(platform: 'facebook' | 'twitter' | 'tiktok', message: string) {
    switch (platform) {
      case 'facebook':
        this.shareOnFacebook(message);
        break;
      case 'twitter':
        this.shareOnTwitter(message);
        break;
      case 'tiktok':
        // TikTok doesn't have a direct web share URL, so we copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
          alert('Message copied to clipboard! You can now paste it in TikTok.');
        });
        break;
    }
  }
}