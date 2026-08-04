# Quick Start Guide - Organization-Agnostic CMS

## 🚀 Try It Right Now!

### 1. Start the Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🎨 Change Your Industry Profile

### Step 1: Go to Settings
1. Login to admin panel
2. Navigate to **Settings > General**

### Step 2: Select Industry Profile
1. Find "Industry Profile" dropdown
2. Choose from:
   - Generic
   - IT & Software
   - Café & Restaurant
   - Retail
   - Construction
   - Healthcare
   - Education
   - NGO & Nonprofit
   - Manufacturing
   - Logistics & Transport
   - Professional Services
   - Hospitality

3. Click "Save Changes"

### Step 3: See the Magic ✨
The entire admin panel instantly transforms!

---

## 📊 What Changes When You Switch Profiles

### Example: Switch to "Healthcare"

**Before (Generic/IT):**
- Dashboard: "Total Customers", "Active Projects"
- Menu: "Customers" → "Projects" → "Services"
- Button: "Add Customer"
- Form fields: Company Name (visible)

**After (Healthcare):**
- Dashboard: "Total Patients", "Active Treatment Plans"
- Menu: "Patients" → "Treatment Plans" → "Services"
- Button: "Add Patient"
- Form fields: Company Name (hidden), Blood Group, Insurance (visible)

---

## 🔧 Customize Your Setup

### Edit Entity Labels
**Path:** Settings > Labels

**What You Can Do:**
- Change "Customer" to anything you want
- Change "Project" to "Order", "Case", "Job", etc.
- Change "Service" to "Product", "Package", etc.
- Change "Team" to "Staff", "Employee", "Volunteer", etc.
- Change "Invoice" to "Bill", "Receipt", "Statement", etc.

**Example:**
- Singular: "Patient"
- Plural: "Patients"

Click "Save Changes" → Entire UI updates!

---

### Add Custom Fields
**Path:** Settings > Custom Fields

**Steps:**
1. Click "Add Custom Field"
2. Select Module: "customer", "project", "service", etc.
3. Enter Field Key: `blood_group`
4. Enter Label: "Blood Group"
5. Select Type: dropdown
6. Add Options: A+, A-, B+, B-, O+, O-, AB+, AB-
7. Set Required: Yes/No
8. Click "Save"

**Result:**
- Field appears in Add/Edit Customer forms
- Values saved per customer
- Can filter/search by custom field

---

### Configure Status Workflows
**Path:** Settings > Status

**Steps:**
1. Select Module: "customer"
2. Click "Add Status"
3. Enter Label: "New Patient"
4. Pick Color: Blue
5. Set as Default: Yes
6. Click "Save"

**Result:**
- Status appears in customer forms
- Can filter customers by status
- Status badges show color

---

## 🎯 Industry-Specific Examples

### For a Medical Clinic

**General Settings:**
- Industry Profile: Healthcare

**Labels:**
- customer → "Patient" / "Patients"
- project → "Treatment Plan" / "Treatment Plans"
- team → "Provider" / "Staff"
- invoice → "Bill" / "Bills"

**Custom Fields (Customer/Patient):**
- Blood Group (dropdown)
- Insurance Provider (text)
- Emergency Contact (text)
- Allergies (text)
- Date of Birth (date)

**Status Workflows (Customer/Patient):**
- New Patient (blue)
- Active (green)
- Discharged (gray)

---

### For a Restaurant

**General Settings:**
- Industry Profile: Café & Restaurant

**Labels:**
- customer → "Guest" / "Guests"
- project → "Event" / "Events"
- service → "Menu Item" / "Menu"
- team → "Staff" / "Staff"
- invoice → "Bill" / "Bills"

**Custom Fields (Customer/Guest):**
- Dietary Preferences (multiselect)
- Allergies (dropdown)
- Birthday (date)
- Loyalty Tier (dropdown)
- Preferred Seating (dropdown)

**Status Workflows (Customer/Guest):**
- Walk-in Guest (blue)
- Regular (green)
- VIP (gold)

---

### For a Construction Company

**General Settings:**
- Industry Profile: Construction

**Labels:**
- customer → "Client" / "Clients"
- project → "Build Project" / "Build Projects"
- service → "Service" / "Services"
- team → "Contractor" / "Team"
- invoice → "Invoice" / "Invoices"

**Custom Fields (Customer/Client):**
- Contract Number (text)
- Property Type (dropdown: Residential, Commercial, Industrial)
- Insurance Provider (text)
- Contract Value (number)

**Custom Fields (Project):**
- Site Address (text)
- Permit Number (text)
- Site Supervisor (text)
- Estimated Duration (number)

**Status Workflows (Project):**
- Bidding (purple)
- Planning (blue)
- In Progress (orange)
- Inspection (pink)
- Completed (green)

---

## 💡 Pro Tips

### 1. Start with a Profile, Then Customize
- Select the closest industry profile
- Let it set up defaults
- Then customize labels and fields to your exact needs

### 2. Use Custom Fields for Industry-Specific Data
- Every business is unique
- Don't modify the code
- Just add custom fields in Settings

### 3. Configure Status Workflows
- Replace generic statuses with your process
- Use colors that match your workflow stages
- Set the most common status as default

### 4. Test with Sample Data
- Add a few test customers with the new profile
- Verify custom fields appear correctly
- Check that labels look natural

---

## 🐛 Troubleshooting

### Labels Not Changing?
- Clear browser cache
- Refresh the page
- Check that you saved in Settings > General

### Custom Fields Not Showing?
- Verify field is set to "Active" in Settings > Custom Fields
- Check that moduleKey matches (customer, project, service, etc.)
- Refresh the Add/Edit modal

### Company Name Still Showing in Healthcare?
- The system auto-hides it for Healthcare, Restaurant, Hospitality, Education
- If you want to force-hide for other profiles, add to code or use fieldVisibility config

---

## 📞 Need Help?

Check the documentation:
- `IMPLEMENTATION_SUMMARY.md` - Full technical overview
- `PHASE_2_COMPLETE.md` - How dynamic labels work
- `PHASE_3_COMPLETE.md` - Customer module features
- `UI_WALKTHROUGH.md` - Detailed UI guide

---

## 🎉 You're Ready!

Your CMS is now organization-agnostic. Configure it for:
- Medical clinics
- Restaurants
- Construction firms
- Law offices
- Schools
- Nonprofits
- Retail stores
- Hotels
- Any business!

**No code changes needed. Just configuration.** 🚀

