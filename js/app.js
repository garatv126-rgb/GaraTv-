
$("#account-open").onclick=authModal;

function authModal(){

 function showSignIn(){
  openModal(`
   <span class="eyebrow">YOUR GARATV ACCOUNT</span>
   <h2>Sign in</h2>
   <p>Access your GaraTV account using your registered email.</p>

   <form id="auth-form" class="modal-form">
    <label class="wide">Email address
     <input name="email" type="email" required autocomplete="email">
    </label>

    <label class="wide">Password
     <input name="password" type="password" required minlength="8" autocomplete="current-password">
    </label>

    <div class="wide">
     <button class="btn btn-red" type="submit">Sign in</button>
     <button class="btn btn-outline" type="button" id="signup-btn">Create account</button>
    </div>
   </form>

   <p class="modal-note">Staff access is assigned by GaraTV administrators. Creating an account does not grant editorial permissions.</p>
  `);

  $("#auth-form").onsubmit=async e=>{
   e.preventDefault();

   if(!sb){
    toast("Supabase is not configured yet.");
    return;
   }

   const fd=new FormData(e.currentTarget);
   const btn=e.currentTarget.querySelector('[type="submit"]');

   btn.disabled=true;
   btn.textContent="Signing in…";

   try{
    const {error}=await sb.auth.signInWithPassword({
     email:fd.get("email").trim(),
     password:fd.get("password")
    });

    if(error)throw error;

    closeModal();
    $("#account-open").textContent="Account";
    toast("Signed in successfully.");

   }catch(err){
    toast(err.message||"Sign in failed.");
    btn.disabled=false;
    btn.textContent="Sign in";
   }
  };

  $("#signup-btn").onclick=showSignUp;
 }

 function showSignUp(){
  openModal(`
   <span class="eyebrow">JOIN GARATV</span>
   <h2>Create your account</h2>
   <p>Register for your GaraTV account.</p>

   <form id="auth-form" class="modal-form">
    <label class="wide">Full name
     <input name="full_name" type="text" required maxlength="120" autocomplete="name">
    </label>

    <label class="wide">Email address
     <input name="email" type="email" required autocomplete="email">
    </label>

    <label class="wide">Password
     <input name="password" type="password" required minlength="8" autocomplete="new-password">
    </label>

    <label class="wide">Confirm password
     <input name="confirm_password" type="password" required minlength="8" autocomplete="new-password">
    </label>

    <div class="wide">
     <button class="btn btn-red" type="submit">Create account</button>
     <button class="btn btn-outline" type="button" id="signin-btn">Back to sign in</button>
    </div>
   </form>

   <p class="modal-note">Creating an account does not automatically grant reporter, editor or administrator permissions.</p>
  `);

  $("#auth-form").onsubmit=async e=>{
   e.preventDefault();

   if(!sb){
    toast("Supabase is not configured yet.");
    return;
   }

   const fd=new FormData(e.currentTarget);
   const fullName=fd.get("full_name").trim();
   const email=fd.get("email").trim();
   const password=fd.get("password");
   const confirmPassword=fd.get("confirm_password");
   const btn=e.currentTarget.querySelector('[type="submit"]');

   if(password!==confirmPassword){
    toast("Your passwords do not match.");
    return;
   }

   btn.disabled=true;
   btn.textContent="Creating account…";

   try{
    const {data,error}=await sb.auth.signUp({
     email,
     password,
     options:{
      data:{
       full_name:fullName
      }
     }
    });

    if(error)throw error;

    if(data.user&&!data.session){
     toast("Account created. Please check your email to confirm it.");
    }else{
     toast("Your GaraTV account has been created.");
     $("#account-open").textContent="Account";
    }

    closeModal();

   }catch(err){
    toast(err.message||"Account creation failed.");
    btn.disabled=false;
    btn.textContent="Create account";
   }
  };

  $("#signin-btn").onclick=showSignIn;
 }

 showSignIn();
}
