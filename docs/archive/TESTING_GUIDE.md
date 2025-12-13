# Testing the Multi-Role System - Quick Start

## How to Test Right Now

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Different Role Combinations

#### Test 1: Single Role - Student
1. Go to login page
2. Enter name: "Alex Student"
3. Click only the "👨‍🎓 Student" button
4. Click "Login"
5. **Expected:**
   - Should navigate to `/home`
   - Navigation shows: Home, Check In, My Logs, Profile
   - Header shows: "Alex Student (student)"
   - No role switcher
   - No admin submenu

#### Test 2: Single Role - Advisor
1. Logout and return to login
2. Enter name: "Jordan Teacher"
3. Click only "👨‍🏫 Advisor"
4. Click "Login"
5. **Expected:**
   - Should navigate to `/dashboard`
   - Navigation shows: Dashboard, Students, Check-ins, Logs, Profile
   - Header shows: "Jordan Teacher (advisor)"
   - No role switcher
   - No admin submenu

#### Test 3: Advisor + Admin
1. Logout and return to login
2. Enter name: "Sam Principal"
3. Click both "👨‍🏫 Advisor" AND "⚙️ Admin"
4. Click "Login"
5. **Expected:**
   - Should navigate to `/dashboard`
   - Navigation shows: Dashboard, Students, Check-ins, Logs, **Admin ▼**, Profile
   - Admin submenu contains: Manage Students, Manage Internships
   - Header shows: "Sam Principal (advisor)"
   - No role switcher (because no mentor role)

#### Test 4: Advisor + Mentor (Key Test!)
1. Logout and return to login
2. Enter name: "Taylor Dual"
3. Click both "👨‍🏫 Advisor" AND "👔 Mentor"
4. Click "Login"
5. **Expected:**
   - Should navigate to `/dashboard`
   - Navigation shows advisor nav
   - Header shows: "Taylor Dual (advisor) **[Switch to mentor]** [Logout]"
   - Role switcher button is visible
6. **Click "Switch to mentor"**
7. **Expected:**
   - Should navigate to `/mentor`
   - Navigation changes to mentor nav (Dashboard, My Students, Profile)
   - Header shows: "Taylor Dual (mentor) **[Switch to advisor]** [Logout]"
   - No admin submenu (even if user has admin role elsewhere)

#### Test 5: All Three Roles (Rare Case)
1. Logout and return to login
2. Enter name: "Casey AllRoles"
3. Click "👨‍🏫 Advisor", "⚙️ Admin", AND "👔 Mentor"
4. Click "Login"
5. **Expected:**
   - Should navigate to `/dashboard`
   - Navigation shows: Dashboard, Students, Check-ins, Logs, Admin ▼, Profile
   - Admin submenu is present
   - Role switcher shows "[Switch to mentor]"
6. **Click "Switch to mentor"**
7. **Expected:**
   - Navigation becomes mentor nav (no admin submenu anymore)
   - Role switcher shows "[Switch to advisor]"
8. **Click "Switch to advisor"**
9. **Expected:**
   - Back to advisor nav with admin submenu
   - Role switcher shows "[Switch to mentor]"

## What Should Work

✅ Multiple role selection on login page
✅ Role hint showing "Selected: advisor + admin"
✅ Initial navigation based on activeRole
✅ Admin submenu appears when hasRole('admin') AND activeRole='advisor'
✅ Role switcher appears when hasRole('advisor') AND hasRole('mentor')
✅ Clicking role switcher changes activeRole and navigation
✅ Role in header updates to show current activeRole
✅ Admin submenu expands/collapses on click

## Known Issues / Expected Limitations

⚠️ **Missing Advisor Pages** - These routes exist in navigation but pages aren't created yet:
- `/students` (AdvisorStudents)
- `/checkins` (AdvisorCheckIns)
- `/logs` (AdvisorLogs - note: different from student /logs)

⚠️ **No Route Protection** - Currently anyone can navigate to any route by typing the URL

⚠️ **Admin Dashboard Route** - There's still an `/admin` route (old admin dashboard) that should probably be removed or redirected

## Quick Fixes if Something Doesn't Work

### Role switcher not showing
**Check:** Does user have BOTH advisor AND mentor roles?
**Solution:** Make sure you clicked both buttons on login page

### Admin submenu not showing
**Check:** Does user have admin role? Is activeRole set to 'advisor'?
**Solution:** 
- Make sure you clicked the Admin button on login
- If activeRole is 'mentor', admin submenu is intentionally hidden

### Navigation doesn't update after switching roles
**Check:** Console for errors
**Solution:** Make sure RoleSwitcher is imported in MainLayout.jsx

### Can't navigate to advisor pages
**Expected:** Those pages don't exist yet - see MULTI_ROLE_IMPLEMENTATION.md

## Console Checks

Open browser console and check:
1. After login, type: `JSON.stringify(localStorage.getItem('user'))`
   - Should show roles array and activeRole
2. After switching roles, check again
   - activeRole should have changed

## Next Steps After Testing

Once you've confirmed the multi-role system works:

1. **Create the missing advisor pages:**
   - AdvisorStudents
   - AdvisorCheckIns  
   - AdvisorLogs

2. **Add route protection** to prevent unauthorized access

3. **Decide what to do with the old `/admin` route** - probably redirect to `/dashboard`

4. **Test with real data** once pages are populated

5. **Polish the UI** - especially mobile responsiveness for role switcher and admin submenu
