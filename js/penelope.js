
(function(){
  const exact={
    "the hobbit":["I've checked this out 437 times. It's still mostly walking.","Thirteen dwarves entered. The pantry never recovered.","This could have been an email, but they chose a mountain."],
    "harry potter":["I've filed seven safety complaints with Hogwarts.","That school has moving stairs and no visible risk committee.","Every September they reopen as though nothing happened."],
    "the hunger games":["I would have declined the invitation.","The waiver form was deeply inadequate.","Reality television should not require archery."],
    "moby dick":["This could have been avoided by choosing a different hobby.","I recommend bird-watching next time.","The whale has declined to comment."],
    "the fellowship of the ring":["I hope somebody packed comfortable shoes.","One ring, nine walkers, and still no shuttle service.","I've shelved this under Aggressive Hiking."],
    "gandalf":["Excellent mentor. Suspicious calendar.","He has once again withheld the second half of the instructions.","Fireworks: approved. Communication plan: under review."],
    "mulan":["She completed the assignment before the army finished onboarding.","Mushu submitted seventeen unapproved strategy changes.","Honor was achieved despite the paperwork."],
    "beauty and the beast":["The library is excellent. The guest policy is alarming.","I have questions about the castle's hiring process.","The furniture appears more emotionally available than management."],
    "the little mermaid":["Never sign a voice contract without legal review.","The sea witch's terms were not borrower-friendly.","Curiosity is admirable. Contract literacy is essential."],
    "frozen":["I've filed a seasonal-weather complaint with Arendelle.","The sisters needed one conversation and several fewer locked doors.","The local forecast remains emotionally complicated."],
    "disney twisted tales":["I turned one page and the entire canon filed an appeal.","Every happily-ever-after has been returned for revision.","The alternate timelines are overdue."]
  };
  const clicks={
    honks:["HONK!","Double honk! HONK HONK!","Librarian honk.","A very official circulation-desk honk."],
    library:["This belongs in Fiction... probably.","I've misplaced the accurate summary.","Please return all facts to the circulation desk.","The catalog insists this is somebody else's problem."],
    busy:["You're keeping me very busy today.","Another search? My feathers are filing overtime.","At this rate, I may need a second stamp."],
    repeat:["Welcome back! I see you're still looking for accurate summaries.","You returned. The facts did not.","I saved your usual seat near the inaccurate reference section."]
  };
  const emergency=[
    "Library Emergency mode activated. I have removed the remaining factual safeguards.",
    "Honk! The nonsense level has exceeded normal circulation limits.",
    "Please remain calm. The synopsis is now operating without supervision.",
    "I have stamped this explanation EXCEPTIONALLY SILLY.",
    "The accurate summary has evacuated the building."
  ];
  const byType={
    Book:["I found the plot and immediately misfiled it.","This book has been shelved under Avoidable Complications."],
    "Book Series":["I reviewed every volume and misunderstood them consistently.","The series has been cataloged under Recurring Problems."],
    Author:["I examined the author's style and filed it under Distinctive Nonsense.","The bibliography is accurate. My explanation is not."],
    Character:["I opened the character file. Their personality needs supervision.","I assessed their strengths, flaws, and questionable choices."]
  };
  const pick=(items,index)=>items[((index%items.length)+items.length)%items.length];
  function lineFor(entry,key,cycle,searchCount,repeat,level){
    if(level==="wild")return pick(emergency,cycle+searchCount);
    if(exact[key])return pick(exact[key],cycle);
    if(searchCount>0&&searchCount%6===0)return pick(clicks.busy,searchCount);
    if(repeat)return pick(["You searched this again. I admire your commitment to misinformation.","Still checking? The accurate version remains checked out."],cycle);
    return pick(byType[entry.type]||clicks.library,cycle);
  }
  function clickLine(honkCount,searchCount,visitCount){
    if(visitCount>2&&honkCount%4===0)return pick(clicks.repeat,honkCount);
    if(searchCount>=5&&honkCount%3===0)return pick(clicks.busy,honkCount);
    if(honkCount%2===0)return pick(clicks.library,honkCount);
    return pick(clicks.honks,honkCount);
  }
  function sound(doubleHonk=false){
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext,ctx=new AudioCtx(),count=doubleHonk?2:1;
      for(let i=0;i<count;i++){
        const osc=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+i*.22;
        osc.type="square";osc.frequency.setValueAtTime(310,start);osc.frequency.exponentialRampToValueAtTime(190,start+.18);
        gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.2,start+.02);gain.gain.exponentialRampToValueAtTime(.0001,start+.24);
        osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+.25);
      }
    }catch(error){console.warn("Honk unavailable",error)}
  }
  window.PenelopePersonality={lineFor,clickLine,sound};
})();
