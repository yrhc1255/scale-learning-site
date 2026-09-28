import {readFileSync,writeFileSync} from 'node:fs';
let s=readFileSync('tests/browser/course.spec.js','utf8');
s=s.replace("await go(page,6);await page.getByRole('checkbox'","await go(page,6);await page.locator('.surface-experiment summary').click();await page.getByRole('checkbox'");
writeFileSync('tests/browser/course.spec.js',s);
