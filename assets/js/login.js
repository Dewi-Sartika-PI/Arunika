// ===== Half-peek karakter (setengah badan terlihat) =====
(function(){
  const root = document.documentElement;
  const char = document.getElementById('char');
  function updatePeek(){
    if(!char) return;
    const h = char.getBoundingClientRect().height || 320;
    const isMobile = matchMedia('(max-width:767px)').matches;
    const ratio = isMobile ? 0.48 : 0.52;
    const peek = Math.max(120, Math.min(220, Math.round(h * ratio)));
    root.style.setProperty('--char-peek', peek + 'px');
  }
  let rf; const onResize=()=>{ cancelAnimationFrame(rf); rf=requestAnimationFrame(updatePeek); };
  addEventListener('load', updatePeek);
  addEventListener('resize', onResize, {passive:true});
  if (char) char.addEventListener('load', updatePeek, {once:true});
})();

// ===== Parallax idle ringan untuk shapes =====
(function(){
  let t=0;
  (function idle(){
    t+=0.016;
    document.querySelectorAll('.floating').forEach((el,i)=>{
      const base=(i%2?1:-1)*4;
      el.style.transform=`translate3d(0, ${Math.sin(t+i)*base}px, 0)`;
    });
    requestAnimationFrame(idle);
  })();
})();

// ===== Login logic menggunakan ArunikaSession (session.js) =====
(function(){
  const form = document.getElementById('login-form');
  const emailE = document.getElementById('email');
  const passE  = document.getElementById('password');
  const emailErr = document.getElementById('email-error');
  const passErr  = document.getElementById('pass-error');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('spinner');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  const googleBtn = document.getElementById('login-google');

  function setLoading(v){
    submitBtn.disabled = v;
    if (spinner) spinner.classList.toggle('hidden', !v);
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = (emailE.value || '').trim();
    const pass  = passE.value || '';

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOk  = pass.length >= 8;

    emailErr.classList.toggle('hidden', emailOk);
    passErr.classList.toggle('hidden', passOk);
    if(!emailOk || !passOk) return;

    setLoading(true);
    try{
      await ArunikaSession.login(email, pass); // dari session.js
      toastText.textContent = 'Berhasil masuk. Mengalihkan…';
      toast.classList.remove('hidden');
      // location.href = 'skill-match.html';
    }catch(err){
      toastText.textContent = err.message || 'Gagal masuk.';
      toast.classList.remove('hidden');
      toast.style.borderColor = 'rgba(255,100,100,.35)';
    }finally{
      setLoading(false);
    }
  });

  googleBtn.addEventListener('click', async ()=>{
    setLoading(true);
    try{
      await ArunikaSession.loginWithGoogle(); // dummy akun
      toastText.textContent='Masuk via Google (dummy).';
      toast.classList.remove('hidden');
      // location.href='skill-match.html';
    }catch(err){
      toastText.textContent= err.message || 'Gagal login Google.';
      toast.classList.remove('hidden');
    }finally{
      setLoading(false);
    }
  });
})();
