import { runAsService } from "./db";

async function email(to:string,subject:string,title:string,message:string){
  const k=process.env.RESEND_API_KEY;
  if(!k)return;
  try{await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${k}`},body:JSON.stringify({from:process.env.RESEND_FROM_EMAIL||"FysiqForge Coach <coach@fysiqforge.app>",to:[to],subject,html:`<div style="font-family:Arial;max-width:520px;margin:auto"><h2 style="color:#FF5500">${title}</h2><p>${message}</p><a href="${process.env.APP_URL||"https://fysiqforge.onrender.com"}" style="display:inline-block;background:#FF5500;color:white;padding:12px 18px;border-radius:8px;text-decoration:none">Ouvrir FysiqForge</a></div>`})})}catch(e){console.error("[reminders/email]",e)}}

export function startPersistentReminderWorker(){
  if(!process.env.DATABASE_URL)return;
  let running=false;
  const tick=async()=>{
    if(running)return;
    running=true;
    try{
      const work=await runAsService(async(client)=>{
        const due=await client.query(`SELECT r.id,r.workout_id,r.user_id,u.email FROM reminders r JOIN users u ON u.id=r.user_id WHERE r.status='pending' AND r.due_notified=false AND r.scheduled_at<=now() ORDER BY r.scheduled_at LIMIT 100`);
        const missed=await client.query(`SELECT r.id,r.workout_id,r.user_id,u.email FROM reminders r JOIN users u ON u.id=r.user_id WHERE r.status='pending' AND r.scheduled_at<now()-interval '24 hours' AND r.missed_notified=false ORDER BY r.scheduled_at LIMIT 100`);
        for(const r of due.rows){
          await client.query(`INSERT INTO notifications(user_id,workout_id,type,title,message) SELECT user_id,$1,'due','🔥 C’est l’heure de ta séance !',$2 FROM reminders WHERE id=$3 AND NOT EXISTS(SELECT 1 FROM notifications n WHERE n.user_id=reminders.user_id AND n.workout_id=$1 AND n.type='due')`,[r.workout_id,"Ta séance prévue est maintenant disponible.",r.id]);
          await client.query("UPDATE reminders SET due_notified=true WHERE id=$1",[r.id]);
        }
        for(const r of missed.rows){
          await client.query(`INSERT INTO notifications(user_id,workout_id,type,title,message) SELECT user_id,$1,'missed','Séance manquée','Ta séance n’a pas encore été marquée comme terminée.' FROM reminders WHERE id=$2`,[r.workout_id,r.id]);
          await client.query("UPDATE reminders SET missed_notified=true,status='missed' WHERE id=$1",[r.id]);
        }
        return {due:due.rows,missed:missed.rows};
      });
      for(const r of work.due) await email(r.email,"🔥 C’est l’heure de ta séance — FysiqForge","C’est l’heure de ta séance !","Ta séance prévue est maintenant disponible.");
      for(const r of work.missed) await email(r.email,"Ta séance t’attend — FysiqForge","Séance manquée","Reprends ton programme et continue ta progression.");
    }catch(e){console.error("[reminder-worker]",e)}finally{running=false}
  };
  void tick();
  setInterval(()=>void tick(),60000);
}
