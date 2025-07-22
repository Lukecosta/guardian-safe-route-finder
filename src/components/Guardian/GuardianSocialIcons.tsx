interface GuardianSocialIconsProps {
  onShare: (platform: 'facebook' | 'twitter' | 'tiktok', message: string) => void;
}

export const GuardianSocialIcons = ({ onShare }: GuardianSocialIconsProps) => {
  const handleShare = (platform: 'facebook' | 'twitter' | 'tiktok') => {
    const message = "I'm safe and using Guardian app to stay protected! 🛡️ #StaySafe #Guardian";
    onShare(platform, message);
  };

  return (
    <div className="guardian-social-icons">
      <button 
        onClick={() => handleShare('facebook')}
        className="guardian-social-icon social-facebook"
        title="Share on Facebook"
      >
        <i className="fab fa-facebook-f"></i>
      </button>
      <button 
        onClick={() => handleShare('twitter')}
        className="guardian-social-icon social-twitter"
        title="Share on X"
      >
        <i className="fab fa-x-twitter"></i>
      </button>
      <button 
        onClick={() => handleShare('tiktok')}
        className="guardian-social-icon social-tiktok"
        title="Share on TikTok"
      >
        <i className="fab fa-tiktok"></i>
      </button>
    </div>
  );
};