import { useSelector } from 'react-redux';

export default () => {
  const businessData = useSelector((state) => state.business.data);
  const handleNativeShare = async ({ title, text, url }) => {
    if (navigator.share !== undefined && businessData) {
      const { ogTags } = businessData;
      try {
        const shareData = {
          title: title || ogTags.title,
          text: text || ogTags.description,
          url: url || window.location.href
        };
        console.log(shareData);
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed.');
      }
    }
  };
  return [handleNativeShare];
};
