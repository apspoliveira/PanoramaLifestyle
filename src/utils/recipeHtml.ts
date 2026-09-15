/** Wraps recipe markup in the styled page used by Activity_FullContent. */
export function buildRecipeHtml(content: string, color: string): string {
  const light = `${color}15`;
  return `<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
body { font-family: 'Poppins', sans-serif; background-color: #F8FAFC; margin: 0; padding: 16px; color: #334155; -webkit-font-smoothing: antialiased; }
.recipe-container { background: #FFFFFF; border-radius: 32px; padding: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); margin-bottom: 20px; }
h1 { color: #1E293B; font-size: 28px; font-weight: 800; line-height: 1.2; margin: 0 0 24px 0; letter-spacing: -0.5px; }
h2, h3 { color: ${color}; font-size: 18px; font-weight: 700; margin: 32px 0 16px 0; display: flex; align-items: center; text-transform: uppercase; letter-spacing: 1.5px; }
h3::before { content: ''; display: inline-block; width: 8px; height: 8px; background-color: ${color}; margin-right: 12px; border-radius: 2px; transform: rotate(45deg); }
ul { padding: 0; list-style: none; margin: 0; background-color: ${light}; border-radius: 20px; padding: 20px; }
li { position: relative; padding-left: 32px; margin-bottom: 14px; font-size: 15px; line-height: 1.6; color: #475569; font-weight: 500; }
li:last-child { margin-bottom: 0; }
li::before { content: '✓'; position: absolute; left: 0; color: ${color}; font-weight: 900; font-size: 18px; line-height: 1; }
p { font-size: 16px; line-height: 1.8; color: #64748B; margin: 16px 0; }
ol { padding-left: 24px; margin: 0; }
ol li { padding-left: 8px; list-style-type: decimal; color: #475569; }
ol li::before { display: none; }
b, strong { color: #1E293B; font-weight: 700; }
.footer { margin-top: 48px; text-align: center; color: #94A3B8; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; border-top: 1px solid #F1F5F9; padding-top: 24px; }
</style></head><body><div class='recipe-container'>${content}<div class='footer'>Newstart Lifestyle • Nutrition</div></div></body></html>`;
}
