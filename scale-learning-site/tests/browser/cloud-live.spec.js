import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

test('real GAS endpoint loads the public cloud leaderboard and supports refresh',async({page})=>{
 const url=process.env.COURSE_TEST_URL||pathToFileURL(resolve('..','index.html')).href;
 await page.goto(url);await page.getByRole('button',{name:'教師模式',exact:true}).click();await page.getByLabel('預覽密碼').fill('55688');await page.getByRole('button',{name:'進入教師預覽'}).click();
 await page.goto(url+'#page-9');
 const board=page.locator('.leaderboard');await expect(board).toContainText('雲端成績');await expect(board.getByRole('button',{name:'更新排行榜',exact:true})).toBeEnabled({timeout:30000});await expect(board.getByRole('alert')).toHaveCount(0);
 await board.getByRole('button',{name:'更新排行榜',exact:true}).click();await expect(board.getByRole('button',{name:'更新排行榜',exact:true})).toBeEnabled({timeout:30000});await expect(board.getByRole('alert')).toHaveCount(0);
});
