(() => {
 const zh=document.documentElement.lang.startsWith('zh');
 const messages={
  'Play images':'播放轮播','Pause images':'暂停轮播',
  'Enter your name.':'请输入您的姓名。',
  'Enter your suburb or postcode.':'请输入所在区域或邮编。',
  'Enter your email address, for example name@example.com.':'请输入有效邮箱，例如 name@example.com。',
  'Choose the affected area, or select Not sure / Other.':'请选择需要处理的区域，或选择“不确定／其他”。',
  'Describe the repair needed or when the problem occurs.':'请描述需要维修的部位或问题出现的时间。',
  'Use 4,000 characters or fewer.':'请将内容控制在 4,000 个字符以内。',
  'Enter a phone number with at least 6 characters, or leave it blank.':'电话号码至少需要 6 个字符，也可以留空。',
  'Please check the highlighted fields and try again.':'请检查标记的填写项后重试。',
  'Sending your assessment request…':'正在发送您的现场评估申请…',
  'Thank you. MEL ONE has received your assessment request. Your visit time is not confirmed; our team will contact you to discuss the assessment.':'感谢您的联系，MEL ONE 已收到现场评估申请。到访时间尚未确认，我们会与您联系，商定评估安排。',
  'We could not confirm your request was received. Your details are still here. Please call 0482 422 607 for help before trying again.':'暂时无法确认申请是否收到。您填写的内容已保留，请先致电 0482 422 607 联系我们，再决定是否重试。'
 };
 window.melOneText=text=>zh?(messages[text]||text):text;
 const languageSwitch=document.querySelector('[data-language-switch]');
 if(languageSwitch){
  const syncLanguageLink=()=>{
   const target=new URL(languageSwitch.href,window.location.href);
   target.search=window.location.search;target.hash=window.location.hash;
   languageSwitch.href=target.pathname+target.search+target.hash;
  };
  syncLanguageLink();window.addEventListener('hashchange',syncLanguageLink);
 }
 const toggle=document.querySelector('[data-hero-toggle]');
 if(toggle && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  toggle.textContent=window.melOneText('Play images');
  toggle.setAttribute('aria-pressed','true');
 }
})();
