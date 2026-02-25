# 🧪 Quick Testing Guide

## ⚡ Fast Testing (5 minutes)

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Interview Questions Page
Visit: http://localhost:3000/interview-questions

**Quick Checks**:
- [ ] Page loads without errors
- [ ] Search bar works (type something)
- [ ] Filters button expands/collapses
- [ ] "No Results Found" text is visible in light mode ✨ (NEW FIX)
- [ ] Switch to dark mode - everything looks good
- [ ] Click "Export CSV" - downloads a file
- [ ] Click "Refresh" - shows loading spinner

### 3. Test Homepage
Visit: http://localhost:3000

**Quick Checks**:
- [ ] Questions appear in terminal animation
- [ ] Jobs appear in terminal animation
- [ ] No console errors (press F12)

### 4. Test Jobs Page
Visit: http://localhost:3000/jobs

**Quick Checks**:
- [ ] Jobs load and display
- [ ] Terminal animation works

### 5. Check Console
Press `F12` → Console tab

**Should see**:
- ✅ `✅ Loaded CSV from GitHub: ...` (if questions loaded)
- ❌ No red errors

---

## 🔍 Detailed Testing (15 minutes)

### Interview Questions - All Features

#### Search Functionality
1. Type "docker" in search → Should show Docker-related questions
2. Type "kubernetes" → Should show Kubernetes questions
3. Type gibberish "xyzabc" → Should show "No Results Found" with visible text
4. Clear search → All questions return

#### Filter Functionality
1. Click "Filters" button → Filters expand
2. Select a company → Questions filtered
3. Select a year → Further filtered
4. Select a topic → Even more filtered
5. Click "Clear All" → All filters removed

#### Light/Dark Mode
1. Toggle theme (top right)
2. In light mode, search for gibberish
3. Verify "No Results Found" text is clearly visible ✨
4. Toggle to dark mode
5. Verify everything still looks good

#### Export & Refresh
1. Click "Export CSV" → File downloads
2. Open CSV file → Verify data is correct
3. Click "Refresh" → Spinner shows, data reloads

---

## 🚀 Production Testing

### Before Deploying

```bash
# 1. Type check
npm run typecheck
# Should show: ✅ No errors

# 2. Build
npm run build
# Should complete successfully

# 3. Test production build
npm run start
# Visit http://localhost:3000
```

### After Deploying

1. Visit your production URL
2. Test all features above
3. Check browser console for errors
4. Test on mobile device
5. Test in different browsers (Chrome, Firefox, Safari)

---

## 🐛 Common Issues & Fixes

### Issue: "No questions available"
**Cause**: GitHub repository doesn't exist or CSV file not found

**Check**:
```bash
# Visit this URL in browser:
https://raw.githubusercontent.com/TrainWithShubham/interview-questions/main/devops/interview-questions.csv
```

**Fix**: Create the repository and CSV file (see WORKFLOW.md)

### Issue: Text not visible in light mode
**Status**: ✅ FIXED in this update

**Verify**: Search for gibberish, check alert text is visible

### Issue: Environment variables not loading
**Fix**:
```bash
# 1. Check .env.local exists
ls -la .env.local

# 2. Restart dev server
# Press Ctrl+C
npm run dev
```

---

## ✅ Testing Checklist

### Functional Testing
- [ ] Interview questions page loads
- [ ] Search works
- [ ] All 6 filters work (company, year, role, experience, topic, contributor)
- [ ] CSV export downloads
- [ ] Refresh button works
- [ ] Jobs page works
- [ ] Homepage works

### Visual Testing
- [ ] Light mode - all text visible ✨
- [ ] Dark mode - all text visible
- [ ] Responsive on mobile
- [ ] No layout issues
- [ ] Proper spacing and alignment

### Error Testing
- [ ] Search with no results shows proper message
- [ ] Network offline shows cached data
- [ ] Invalid filters handled gracefully

### Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] Search responds in < 500ms
- [ ] No console errors
- [ ] No memory leaks

---

## 📊 Success Criteria

All tests pass = ✅ Ready to deploy!

**Build Status**: ✅ Passing  
**Type Check**: ✅ Passing  
**Light Mode Fix**: ✅ Applied  
**Documentation**: ✅ Complete  

---

## 🎯 Quick Test Command

```bash
# Run all checks at once
npm run typecheck && npm run build && echo "✅ All checks passed!"
```

If this succeeds, you're good to go! 🚀
