const generateBtn = document.getElementById('generateBtn');
const telegramBtn = document.getElementById('telegramBtn');
const promptEl = document.getElementById('prompt');
const sizeEl = document.getElementById('size');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const message = document.getElementById('message');

telegramBtn.addEventListener('click', () => {
  window.open('https://t.me/Kami_Broken5','_blank');
});

generateBtn.addEventListener('click', async () => {
  const prompt = promptEl.value.trim();
  const size = sizeEl.value;
  if(!prompt){ message.textContent='Please enter a prompt'; return; }

  message.textContent='';
  loader.style.display='block';
  result.innerHTML=''; // clear previous image

  try {
    const apikey = 'prince'; // API key
    const apiUrl = `https://api.princetechn.com/api/ai/text2img?apikey=${apikey}&prompt=${encodeURIComponent(prompt)}&size=${size}`;

    const response = await fetch(apiUrl);
    if(!response.ok) throw new Error('Network response was not ok');

    const contentType = response.headers.get('content-type');
    let imgSrc = '';

    if(contentType && contentType.includes('image')){
      const blob = await response.blob();
      imgSrc = URL.createObjectURL(blob);
    } else {
      const data = await response.json();
      if(data.url) imgSrc = data.url;
      else if(data.image) imgSrc = data.image;
      else throw new Error('No image returned from API');
    }

    // Display 1 image only
    const img = document.createElement('img');
    img.src = imgSrc;
    result.appendChild(img);

    // Download button
    const download = document.createElement('span');
    download.className='download-single';
    download.textContent='⬇️ Download';
    download.onclick=()=>{ const a=document.createElement('a'); a.href=imgSrc; a.download='kami_ai_image.png'; a.click(); };
    result.appendChild(download);

  } catch(err){
    console.error(err);
    message.textContent='⚠️ Network or API error. Try again!';
  } finally{
    loader.style.display='none';
  }
});
