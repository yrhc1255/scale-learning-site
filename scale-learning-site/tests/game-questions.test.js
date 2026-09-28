import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,assessment,gameCards,challengeBank} from '../src/data.js';

test('game and challenge keep their round counts and use independent, unambiguous questions',()=>{
 assert.equal(gameCards.length,9);assert.equal(challengeBank.length,19);
 const earlier=new Set([...Object.values(questions).flat(),...assessment].map(q=>q.prompt));
 const prompts=[...gameCards.map(q=>q.clue),...challengeBank.map(q=>q.prompt)];
 assert.equal(new Set(prompts).size,prompts.length);
 for(const prompt of prompts)assert.ok(!earlier.has(prompt));
 assert.equal(new Set(challengeBank.map(q=>q.id)).size,19);
 for(const q of [...gameCards,...challengeBank]){
  assert.equal(new Set(q.options).size,4);
  assert.equal(q.options.filter(o=>o===q.answer).length,1);
  assert.ok(q.explain);
 }
});

test('new numerical challenge answers agree with unit conversions and scale calculations',()=>{
 const expected=[
  [0.06*1000,'μm'],[4.2*10,'mm'],[3*1000,'nm'],[2.4*1000,'m'],
  null,[30*3,'μm'],[80/2,'μm'],[72/6,'μm'],[6/2*40,'μm'],
  [160,'μm'],[3/2*8,'mm'],[3.2*10-12,'mm']
 ];
 for(let i=0;i<expected.length;i++)if(expected[i]){
  const [n,unit]=expected[i];assert.equal(challengeBank[i].answer,`${n.toLocaleString('en-US')} ${unit}`);
 }
 assert.ok(0.12*1000>90);assert.equal(challengeBank[4].answer,'B 較長');
 assert.equal(gameCards[6].answer,`${15*4} μm`);
 assert.equal(gameCards[8].answer,`${35/5} mm`);
});
