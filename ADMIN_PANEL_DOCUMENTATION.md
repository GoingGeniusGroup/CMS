# Admin Panel - Complete Documentation

## Table of Contents
1. [Dashboard](#dashboard)
2. [Customer Management](#customer-management)
3. [Projects / Portfolio](#projects--portfolio)
4. [Team Management](#team-management)
5. [Services Management](#services-management)
6. [Careers / Job Vacancies](#careers--job-vacancies)
7. [Analytics](#analytics)
8. [Invoices](#invoices)
9. [Blog Management](#blog-management)
10. [Pages Management](#pages-management)
11. [Category Management](#category-management)
12. [Website Setup](#website-setup)
13. [Settings](#settings)

---

## Dashboard

### Page Name
**Dashboard**

### Purpose
The Dashboard is the main landing page of the admin panel providing an overview of key business metrics, revenue trends, and growth indicators.

### Header Section
- **Title**: "Dashboard"
- **Description**: "Hi, Admin. Welcome back to Admin!"
- **Filter Period Dropdown** (interactive button)
  - **Icon**: Calendar icon
  - **Options**:
    - This Year (default)
    - Last 30 Days
    - Last 3 Months
    - Last 6 Months
    - Last 12 Months
    - All Time

### Statistics Cards (4 cards)

#### 1. Active Projects
- **Icon**: Folder icon
- **Value**: Count of published projects in the selected period
- **Label**: "Active Projects"
- **Delta**: Percentage change compared to last 30 days (shows up/down trend)
- **Calculation**: Counts projects with status "Published" within the filtered date range. Delta is calculated by comparing current period count to same period from previous year.
- **Data Source**: `prisma.project.count({ where: { status: "Published" } })`


#### 2. Total Clients
- **Icon**: Users icon
- **Value**: Count of customers created in the selected period
- **Label**: "Total Clients"
- **Delta**: Percentage change compared to last 30 days (shows up/down trend)
- **Calculation**: Counts all customers (Customer table) created within the filtered date range. Delta compares current to previous year's same period.
- **Data Source**: `prisma.customer.count()`

#### 3. Pending Tasks
- **Icon**: Calendar icon
- **Value**: Count of pending invoices in the selected period
- **Label**: "Pending Tasks"
- **Delta**: Percentage change compared to last 30 days (shows up/down trend)
- **Calculation**: Counts invoices with status "Pending" within the filtered date range
- **Data Source**: `prisma.invoice.count({ where: { status: "Pending" } })`

#### 4. Total Revenue
- **Icon**: Trending Up icon
- **Value**: Sum of paid invoices in the selected period (displayed as "Rs. X")
- **Label**: "Total Revenue"
- **Delta**: Percentage change compared to last 30 days (shows up/down trend)
- **Calculation**: Sums the `total` field of all invoices with status "Paid" within the filtered date range
- **Data Source**: `prisma.invoice.aggregate({ where: { status: "Paid" }, _sum: { total: true } })`

### Revenue Chart Card

**Card Title**: "Revenue"
**Total Display**: Sum of all monthly revenue values (e.g., "165k")

**Chart Type**: Bar Chart
- **X-Axis**: Month abbreviations (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec)
- **Y-Axis**: Revenue values in thousands (k)
- **Bars**: Color-coded by status
  - **Yellow (#facc15)**: Received
  - **Green (#34d399)**: Pending
  - **Red (#f43f5e)**: Overdue

**Data Calculation**:
- Groups invoices by month within the selected period
- Categorizes each month by dominant status (overdue, pending, or received)
- Displays revenue in thousands (divided by 1000)
- Tooltip shows exact value on hover

**Legend**:
- Received (Yellow circle)
- Pending (Green circle)
- Overdue (Red circle)

**Actions Menu** (three dots icon):
- View
- Export
- Remove


### This Year's Growth Card

**Card Title**: "This Year's Growth"

**Display**: Three circular progress rings

#### 1. Web & Software
- **Value**: Percentage of completed projects (published projects / total projects * 100)
- **Color**: Red (#f43f5e)
- **Track Color**: Light Red (#fee2e2)
- **Calculation**: `(totalPublishedProjects / totalProjects) * 100`
- **Data Source**: Count of projects with status "Published" divided by total project count

#### 2. Customer Growth
- **Value**: Year-over-year customer growth rate
- **Color**: Green (#10b981)
- **Track Color**: Light Green (#d1fae5)
- **Calculation**: `(customersThisYear / totalCustomers) * 100`
- **Data Source**: Customers created this year compared to total customers

#### 3. On-time Projects
- **Value**: Percentage of projects completed on time
- **Color**: Blue (#0ea5e9)
- **Track Color**: Light Blue (#e0f2fe)
- **Calculation**: `(projectsWithDates / totalProjectsWithDates) * 100`
- **Data Source**: Published projects that have both start and end dates

---

## Customer Management

### Page Name
**Customers**

### Purpose
Manage all customer records including personal information, contact details, company information, and service assignments.

### Header Section
- **Title**: "Customers"
- **Description**: "Manage your customers."
- **Filter Button**: Opens dropdown with Status and Service filters
- **Add Customer Button**: Opens the Add Customer modal


### Statistics Cards (3 cards)

#### 1. Total Customers
- **Icon**: Users icon
- **Value**: Total count of all customers
- **Label**: "Total Customers"
- **Data Source**: `prisma.customer.count()`

#### 2. Active
- **Icon**: User Check icon
- **Value**: Count of customers with status "Active"
- **Label**: "Active"
- **Data Source**: `prisma.customer.count({ where: { status: "Active" } })`

#### 3. Inactive
- **Icon**: User X icon
- **Value**: Count of customers with status "Inactive"
- **Label**: "Inactive"
- **Data Source**: `prisma.customer.count({ where: { status: "Inactive" } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Active
- Inactive

**Service Filter**:
- All Services
- [List of services dynamically populated from customer records]

### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search customers..."
- **Searches**: Full name, email, company name, service name


### List View Table

**Columns**:
1. **#**: Sequential row number (01, 02, 03, etc.)
2. **Customer**: Avatar image + Full name + Company name (if exists)
3. **Email**: Customer email address
4. **Phone**: Phone number (or "—" if empty)
5. **Service**: Associated service name (or "—" if none)
6. **Status**: Badge (Green "Active" or Red "Inactive")
7. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Displays customer avatar (or default Users icon)
- Full name
- Company name (if exists)
- Status badge
- Email with mail icon
- Phone number (if exists)
- Associated service (if exists)
- Action buttons: View, Edit, Delete

### Pagination
- Shows "Showing X to Y of Z entries"
- Page navigation buttons
- Displayed when more than 10 customers exist

### Add Customer Modal

**Modal Title**: "Add New Customer"

**Input Fields**:
1. **Profile Photo** (File Upload)
   - Type: Image upload
   - Optional
   - Accepts image files

2. **Full Name** (Text)
   - Type: Text input
   - Required: Yes
   - Validation: Must not be empty

3. **Email Address** (Email)
   - Type: Email input
   - Required: Yes
   - Validation: Must be valid email format

4. **Phone Number** (Text)
   - Type: Text input
   - Required: No
   - Optional


5. **Company Name** (Text)
   - Type: Text input
   - Required: No
   - Optional

6. **Address** (Textarea)
   - Type: Textarea
   - Required: No
   - Optional

7. **Service** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: List of available services from Service table
   - Shows service name

8. **Status** (Dropdown)
   - Type: Select dropdown
   - Required: Yes
   - Default: Active
   - Options: Active, Inactive

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Add Customer**: Saves the new customer and refreshes the list

### Edit Customer Modal

**Modal Title**: "Edit Customer"

**Input Fields**: Same as Add Customer Modal but pre-filled with existing customer data

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Update Customer**: Saves changes and refreshes the list

### Delete Confirmation Modal

**Modal Title**: "Delete Customer"
**Message**: "Are you sure you want to delete this customer? This action cannot be undone."

**Action Buttons**:
- **Cancel**: Closes modal without deleting
- **Logout** (red button): Confirms deletion and removes customer

### View Detail Modal

**Modal Title**: Customer's full name
**Shows**:
- Customer profile image (if exists)
- Full Name
- Email
- Phone
- Company
- Service
- Status
- Address

---


## Projects / Portfolio

### Page Name
**Projects / Portfolio**

### Purpose
Manage portfolio projects including project details, descriptions, galleries, technologies, customer assignments, team assignments, and service categorization.

### Header Section
- **Title**: "Projects / Portfolio"
- **Description**: "Manage your Portfolio Projects."
- **Filter Button**: Opens dropdown with Status, Category, Customer, and Service filters
- **Add Project Button**: Opens the Add Project modal

### Statistics Cards (3 cards)

#### 1. Total Projects
- **Icon**: Folder icon
- **Value**: Total count of all projects
- **Label**: "Total Projects"
- **Data Source**: `prisma.project.count()`

#### 2. Published
- **Icon**: File Text icon
- **Value**: Count of projects with status "Published"
- **Label**: "Published"
- **Data Source**: `prisma.project.count({ where: { status: "Published" } })`

#### 3. Drafts
- **Icon**: File Edit icon
- **Value**: Count of projects with status "Draft"
- **Label**: "Drafts"
- **Data Source**: `prisma.project.count({ where: { status: "Draft" } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Published
- Draft

**Category Filter**:
- All Categories
- [Dynamically populated from project categories]

**Customer Filter**:
- All Customers
- [Dynamically populated from assigned customers]

**Service Filter**:
- All Services
- [Dynamically populated from assigned services]


### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search projects..."
- **Searches**: Title, customer name, service name

### List View Table

**Columns**:
1. **#**: Sequential row number
2. **Thumbnail**: Project thumbnail image or gradient placeholder
3. **Title**: Project title
4. **Customer**: Customer full name (or "—")
5. **Service**: Service name (or "—")
6. **Status**: Badge (Green "Published" or Red "Draft")
7. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Project thumbnail (or gradient placeholder)
- Project title
- Status badge
- Description (if exists)
- Client name
- Service name
- Budget (if exists)
- Action buttons: View, Edit, Delete

### Add/Edit Project Modal

**Modal Title**: "Add New Project" or "Edit Project"

**Tabs**: General, Content, SEO

#### General Tab Fields:

1. **Thumbnail** (File Upload)
   - Type: Image upload
   - Optional
   - Label: "Project Thumbnail"

2. **Title** (Text)
   - Type: Text input
   - Required: Yes
   - Validation: Must not be empty

3. **Slug** (Text)
   - Type: Text input
   - Required: No
   - Auto-generated from title


4. **Description** (Textarea)
   - Type: Textarea
   - Required: No

5. **Category** (Text)
   - Type: Text input
   - Required: No

6. **Customer** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: List of customers from Customer table

7. **Team** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: List of team members from Team table

8. **Service** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: List of services from Service table

9. **Status** (Dropdown)
   - Type: Select dropdown
   - Required: Yes
   - Options: Published, Draft

10. **Start Date** (Date)
    - Type: Date picker
    - Required: No

11. **End Date** (Date)
    - Type: Date picker
    - Required: No

12. **Budget** (Number)
    - Type: Number input
    - Required: No
    - Format: Numeric value

13. **Live URL** (Text)
    - Type: URL input
    - Required: No

14. **Gallery** (Multiple File Upload)
    - Type: Multiple image upload
    - Required: No
    - Accepts multiple images

15. **Technologies** (Multi-select)
    - Type: Tag input / Multi-select
    - Required: No
    - Can add multiple technologies


#### Content Tab Fields:

16. **Overview** (Rich Text Editor)
    - Type: Rich text / Tiptap editor
    - Required: No
    - Supports formatting

17. **Highlights** (Array of Texts)
    - Type: Array input
    - Required: No
    - Multiple string entries

18. **Challenges** (Array of Texts)
    - Type: Array input
    - Required: No

19. **Solutions** (Array of Texts)
    - Type: Array input
    - Required: No

20. **Features** (Structured Data)
    - Type: JSON/Object input
    - Required: No

21. **Results** (Structured Data)
    - Type: JSON/Object input
    - Required: No

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Save Project** / **Update Project**: Saves the project and refreshes the list

### Delete Confirmation Modal

**Modal Title**: "Delete Project"
**Message**: "Are you sure you want to delete this project? This action cannot be undone."

**Action Buttons**:
- **Cancel**: Closes modal
- **Delete**: Confirms deletion

### View Detail Modal

**Modal Title**: Project title
**Shows**:
- Thumbnail image
- Title
- Category
- Status
- Customer
- Service
- Budget
- Start Date
- End Date
- Description

---


## Team Management

### Page Name
**Team**

### Purpose
Manage team members including their personal information, roles, departments, contact details, social media links, and professional details.

### Header Section
- **Title**: "Team"
- **Description**: "Manage Your team members and their information."
- **Filter Button**: Opens dropdown with Status and Department filters
- **Add Member Button**: Opens the Add Member modal

### Statistics Cards (4 cards)

#### 1. Total Members
- **Icon**: Users icon
- **Value**: Total count of all team members
- **Label**: "Total Members"
- **Data Source**: `prisma.team.count()`

#### 2. Active Members
- **Icon**: Users icon
- **Value**: Count of team members with status "Active"
- **Label**: "Active Members"
- **Data Source**: `prisma.team.count({ where: { status: "Active" } })`

#### 3. Inactive
- **Icon**: User icon
- **Value**: Count of team members with status "Inactive"
- **Label**: "Inactive"
- **Data Source**: `prisma.team.count({ where: { status: "Inactive" } })`

#### 4. Departments
- **Icon**: User icon
- **Value**: Count of unique departments
- **Label**: "Departments"
- **Calculation**: Count of unique department values from team members

### Filter Dropdown
**Status Filter**:
- All Statuses
- Active
- Inactive

**Department Filter**:
- All Departments
- [Dynamically populated from team member departments]


### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search Member...."
- **Searches**: Full name, email, role, department

### List View Table

**Columns**:
1. **Image**: Member profile photo or avatar placeholder
2. **Name**: Full name
3. **Role**: Job role/designation (or "—")
4. **Department**: Department name (or "—")
5. **Phone**: Phone number (or "—")
6. **Email**: Email address
7. **Status**: Text status (Active/Inactive)
8. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Profile image or user icon placeholder
- Full name
- Role/Designation
- Status indicator (Active/Inactive)
- Phone number with icon
- Email address with icon
- Action buttons: View, Edit, Delete

### Add/Edit Member Modal

**Modal Title**: "Add New Member" or "Edit Member"

**Input Fields**:

1. **Profile Photo** (File Upload)
   - Type: Image upload
   - Required: No
   - Label: "Profile Picture"

2. **Full Name** (Text)
   - Type: Text input
   - Required: Yes
   - Validation: Must not be empty

3. **Designation/Role** (Text)
   - Type: Text input
   - Required: No

4. **Department** (Text)
   - Type: Text input
   - Required: No


5. **Email** (Email)
   - Type: Email input
   - Required: Yes
   - Validation: Must be valid email

6. **Phone** (Text)
   - Type: Text input
   - Required: No

7. **Status** (Dropdown)
   - Type: Select dropdown
   - Required: Yes
   - Options: Active, Inactive

8. **Bio/Description** (Textarea)
   - Type: Textarea
   - Required: No

9. **Location** (Text)
   - Type: Text input
   - Required: No

10. **Experience** (Text)
    - Type: Text input
    - Required: No

11. **Skills** (Array/Tags)
    - Type: Tag input
    - Required: No
    - Multiple skills can be added

12. **Facebook URL** (Text)
    - Type: URL input
    - Required: No

13. **Twitter URL** (Text)
    - Type: URL input
    - Required: No

14. **Instagram URL** (Text)
    - Type: URL input
    - Required: No

15. **LinkedIn URL** (Text)
    - Type: URL input
    - Required: No

16. **Website URL** (Text)
    - Type: URL input
    - Required: No

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Add Member** / **Update Member**: Saves member and refreshes the list


### Delete Confirmation Modal

**Modal Title**: "Delete Member"
**Message**: "Are you sure you want to delete this team member? This action cannot be undone."

**Action Buttons**:
- **Cancel**: Closes modal without deleting
- **Delete**: Confirms deletion and removes member

### View Detail Modal

**Modal Title**: Member's full name
**Shows**:
- Profile image (if exists)
- Name
- Role
- Department
- Email
- Phone
- Status
- Bio
- Location
- Experience
- Skills (comma-separated)

---

## Services Management

### Page Name
**Services**

### Purpose
Manage company services including name, description, thumbnail image, featured status, and active/inactive status. Services appear on the website's services page and are linked to customers and projects.

### Header Section
- **Title**: "Services"
- **Description**: "Manage all your services."
- **Filter Button**: Opens dropdown with Status, Featured, and Category filters
- **Add Service Button**: Opens the Add Service modal

### Statistics Cards (3 cards)

#### 1. Total Services
- **Icon**: Layers icon
- **Value**: Total count of all services
- **Label**: "Total Services"
- **Data Source**: `prisma.service.count()`

#### 2. Active
- **Icon**: Check Circle icon
- **Value**: Count of services where isActive is true
- **Label**: "Active"
- **Data Source**: `prisma.service.count({ where: { isActive: true } })`

#### 3. Inactive
- **Icon**: X Circle icon
- **Value**: Count of services where isActive is false
- **Label**: "Inactive"
- **Data Source**: `prisma.service.count({ where: { isActive: false } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Active
- Inactive

**Featured Filter**:
- All
- Featured
- Not Featured

**Category Filter**:
- All Categories
- [Dynamically populated from service categories in current page]

### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search services..."
- **Searches**: Service name, description text, category

### List View Table

**Columns**:
1. **#**: Sequential row number
2. **Thumbnail**: Service thumbnail image or gradient placeholder
3. **Service Name**: Name of the service
4. **Description**: Truncated plain-text description (max 120 characters)
5. **Status**: Badge (Green "Active" or Red "Inactive")
6. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Thumbnail image (full square, or gradient placeholder)
- Service name
- Status badge
- Description (2-line truncated)
- Category (if set)
- Base Price (if set)
- Action buttons: View, Edit, Delete

### Add Service Modal

**Modal Title**: "Add Service"

**Input Fields**:

1. **Title** (Text)
   - Type: Text input
   - Required: Yes
   - Validation: Must not be empty
   - Label: "Title *"

2. **Description** (Rich Text Editor)
   - Type: Tiptap rich text editor
   - Required: Yes
   - Validation: Must not be empty
   - Supports full formatting (bold, italic, lists, headings, etc.)

3. **Thumbnail** (Image Upload)
   - Type: Image upload via Uploadcare
   - Required: No
   - Label: "Thumbnail"

4. **Featured Service** (Toggle)
   - Type: Toggle switch
   - Required: No
   - Default: Off
   - When enabled, marks service as featured

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Add Service**: Saves new service and refreshes the list

### Edit Service Modal

**Modal Title**: "Edit Service"

**Input Fields**: Same as Add Service plus additional fields:
- **Category** (Text) - Optional, text input
- **Base Price** (Number) - Optional, numeric
- **Status** (Toggle) - Active/Inactive toggle

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Save Changes**: Updates service and refreshes the list

### Delete Confirmation Modal

**Modal Title**: "Delete Service"
**Message**: "Are you sure you want to delete this service? This action cannot be undone."

**Action Buttons**:
- **Cancel**: Closes modal
- **Delete**: Confirms deletion

### View Detail Modal

**Modal Title**: Service name
**Shows**:
- Thumbnail image
- Name
- Category
- Base Price
- Status (Active/Inactive)
- Featured (Yes/No)
- Description (plain text preview)

---


## Careers / Job Vacancies

### Page Name
**Careers**

### Purpose
Manage job vacancy postings and view candidate applications. Allows creating, editing, and deleting job openings. Applicants who apply through the public website can be viewed per vacancy.

### Header Section
- **Title**: "Careers"
- **Description**: "Manage all your career vacancies."
- **Filter Button**: Opens dropdown with Status, Department, Type, and Mode filters
- **Add Vacancy Button**: Opens the Add Vacancy modal

### Statistics Cards (3 cards)

#### 1. Total Vacancies
- **Icon**: Briefcase icon
- **Value**: Total count of all job vacancies
- **Label**: "Total Vacancies"
- **Data Source**: `prisma.jobVacancy.count()`

#### 2. Active
- **Icon**: Check Circle icon
- **Value**: Count of active vacancies
- **Label**: "Active"
- **Data Source**: `prisma.jobVacancy.count({ where: { isActive: true } })`

#### 3. Inactive
- **Icon**: X Circle icon
- **Value**: Count of inactive vacancies
- **Label**: "Inactive"
- **Data Source**: `prisma.jobVacancy.count({ where: { isActive: false } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Active
- Inactive

**Department Filter**:
- All Departments
- [Dynamically populated from existing vacancies]

**Type Filter**:
- All Types
- [Dynamically populated from vacancy employment types]

**Mode Filter**:
- All Modes
- [Dynamically populated from vacancy work modes]

### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search vacancies..."
- **Searches**: Job title, department, description

### List View Table

**Columns**:
1. **#**: Sequential row number
2. **Job Title**: Title of the vacancy
3. **Department**: Department name
4. **Type / Mode**: Employment type and work mode (e.g., "Full-time (Remote)")
5. **Salary**: Salary range text
6. **Applicants**: Button showing count (e.g., "3 Candidates") — clicking opens the Applicants modal
7. **Status**: Badge (Green "Active" or Red "Inactive")
8. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Department name (uppercase label)
- Status badge
- Job title
- Type, Mode, Location
- Description (2-line truncated)
- Salary range
- Applicant count (clickable link)
- Action buttons: View, Edit, Delete

### Add Vacancy Modal

**Modal Title**: "Add Vacancy"

**Input Fields**:

1. **Job Title** (Text)
   - Type: Text input
   - Required: Yes
   - Validation: Must not be empty

2. **Department** (Dropdown)
   - Type: Select dropdown
   - Required: Yes
   - Options: Developer, Design, Marketing, Operations, Sales, HR, Quality Assurance

3. **Employment Type** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: Full-time, Part-time, Contract, Internship

4. **Work Mode** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: Remote, On-site, Hybrid

5. **Experience** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "e.g. 2-4 years"

6. **Location** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "e.g. Kathmandu / Remote"

7. **Salary / Compensation** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "e.g. $60k - $85k / yr"

8. **Application Deadline** (Date)
   - Type: Date picker
   - Required: No

9. **Open Vacancies** (Number)
   - Type: Number input
   - Required: No
   - Default: 2

10. **Tags / Skills** (Text, comma-separated)
    - Type: Text input
    - Required: No
    - Placeholder: "React, Next.js, TypeScript"

11. **Active Status** (Checkbox)
    - Type: Checkbox
    - Default: Checked (Active)

12. **Featured Vacancy** (Checkbox)
    - Type: Checkbox
    - Default: Unchecked

13. **Description** (Textarea)
    - Type: Textarea
    - Required: No
    - Rows: 3

14. **Responsibilities** (Textarea)
    - Type: Textarea
    - Required: No
    - Note: Present in Edit modal, line-by-line

15. **Requirements** (Textarea)
    - Type: Textarea
    - Required: No
    - Note: Present in Edit modal, line-by-line

16. **Thumbnail** (Image Upload)
    - Type: Image upload via Uploadcare
    - Required: No
    - Max file size: 2MB

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Save Vacancy**: Saves new vacancy and refreshes the list

### Edit Vacancy Modal

Same fields as Add Vacancy, pre-filled with existing data.

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Save Changes**: Updates vacancy and refreshes the list

### View Applicants Modal

Triggered by clicking the "X Candidates" button on any vacancy row.

**Purpose**: View all applications submitted for that vacancy.
**Shows**: List of applicants with their details and application status.
**Status Updates**: Admin can update applicant status within this modal.

### Delete Confirmation Modal

**Modal Title**: "Delete Job Vacancy"
**Message**: "Are you sure you want to delete this vacancy post? Candidates won't be able to apply anymore."

**Action Buttons**:
- **Cancel**: Closes modal
- **Delete**: Confirms deletion

### View Detail Modal

**Modal Title**: Job title
**Shows**:
- Thumbnail image
- Job Title
- Department
- Employment Type
- Work Mode
- Location
- Salary Range
- Experience
- Open Vacancies
- Application Deadline
- Status (Active/Inactive)
- Featured (Yes/No)
- Skills / Tags
- Description
- Responsibilities
- Requirements

---

## Analytics

### Page Name
**Analytics**

### Purpose
View metrics and reports for the website.

**Current Implementation Status**: The Analytics page is a placeholder. It currently only renders the page title "Analytics" and description "View metrics and reports." No charts, data tables, or statistics are implemented. The page is not yet connected to any data source.

---


## Invoices

### Page Name
**Invoices**

### Purpose
Create, manage, and track invoices for customers and projects. Includes status tracking (Paid, Pending, Overdue) and a print-to-PDF feature.

### Header Section
- **Title**: "Invoices"
- **Description**: "Manage and track all your invoices."
- **Filter Button**: Opens dropdown with Status filter
- **Add Invoice Button**: Opens the Add Invoice modal

### Statistics Cards (4 cards)

#### 1. Total Invoices
- **Icon**: Wallet icon
- **Value**: Total count of all invoices
- **Label**: "Total Invoices"
- **Data Source**: `prisma.invoice.count()`

#### 2. Paid
- **Icon**: Wallet icon
- **Value**: Count of invoices with status "Paid"
- **Label**: "Paid"
- **Data Source**: `prisma.invoice.count({ where: { status: "Paid" } })`

#### 3. Pending
- **Icon**: Wallet icon
- **Value**: Count of invoices with status "Pending"
- **Label**: "Pending"
- **Data Source**: `prisma.invoice.count({ where: { status: "Pending" } })`

#### 4. Overdue
- **Icon**: Wallet icon
- **Value**: Count of invoices with status "Overdue"
- **Label**: "Overdue"
- **Data Source**: `prisma.invoice.count({ where: { status: "Overdue" } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Paid
- Pending
- Overdue

### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search invoices..."
- **Searches**: Invoice number, customer name, project titles, status

### List View Table

**Columns**:
1. **Invoice #**: Invoice number (e.g., INV-001)
2. **Customer**: Customer full name (or "—")
3. **Category**: Invoice category (or "—")
4. **Projects**: Associated project titles, comma-separated (or "—")
5. **Amount**: Total amount (Rs. formatted)
6. **Status**: Colored badge — Green "Paid", Yellow "Pending", Red "Overdue"
7. **Actions**: View, Edit, Print, Delete buttons

### Card View Grid
- Invoice number
- Customer name
- Status badge
- Projects
- Category
- Amount (with Rs. prefix)
- Issued date
- Due date
- Action buttons: View, Edit, Print, Delete

### Add Invoice Modal

**Modal Title**: "Add Invoice"

**Input Fields**:

1. **Invoice Number** (Text)
   - Type: Text input
   - Required: Yes
   - Placeholder: "INV-001"

2. **Customer** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: List of customers from Customer table

3. **Category** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "e.g. Consulting, Development"

4. **Projects** (Multi-select Checkboxes)
   - Type: Scrollable checkbox list
   - Required: No
   - Options: List of projects from Project table
   - Multiple projects can be selected

5. **Amount** (Number)
   - Type: Number input (decimal)
   - Required: Yes
   - Placeholder: "0.00"

6. **Tax** (Number)
   - Type: Number input (decimal)
   - Required: No
   - Default: 0.00
   - Placeholder: "0.00"

7. **Total** (Read-only Display)
   - Type: Calculated display (Amount + Tax)
   - Format: "Rs. X,XXX"

8. **Issued Date** (Date)
   - Type: Date picker
   - Required: No

9. **Due Date** (Date)
   - Type: Date picker
   - Required: No

10. **Status** (Dropdown)
    - Type: Select dropdown
    - Required: Yes
    - Default: Pending
    - Options: Pending, Paid, Overdue

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Add Invoice** / **Save Changes**: Saves and refreshes the list

### Print Invoice Modal

Triggered by clicking the Print button on any invoice row.

**Purpose**: Renders a printable invoice layout.
**Data shown on the invoice**:
- Company name (from General Settings)
- Company address (from Contact Settings)
- Company email (from Contact Settings)
- Company phone (from Contact Settings)
- Invoice number
- Customer name
- Project list
- Amount, Tax, Total
- Issued date, Due date
- Status

**Action Buttons**:
- **Print** / **Download**: Triggers browser print dialog
- **Close**: Closes the modal

### Delete Confirmation Modal

**Modal Title**: "Delete Invoice"
**Message**: "Are you sure you want to delete this invoice? This action cannot be undone."

**Action Buttons**:
- **Cancel**: Closes modal
- **Delete**: Confirms deletion

### View Detail Modal

**Modal Title**: Invoice number
**Shows**:
- Invoice #
- Customer
- Category
- Projects
- Amount
- Tax
- Total
- Status
- Issued date
- Due date

---


## Blog Management

### Page Name
**Blog**

### Purpose
Create and manage blog posts. Each blog post has a rich text editor for content, categories, tags, author assignment, thumbnail, and publish/draft status.

### Header Section
- **Title**: "Blog"
- **Description**: "Manage all your blogs."
- **Filter Button**: Opens dropdown with Status, Category, and Author filters
- **Add Blog Button**: Opens the Add Blog modal

### Statistics Cards (3 cards)

#### 1. Total Blogs
- **Icon**: Newspaper icon
- **Value**: Total count of all blogs
- **Label**: "Total Blogs"
- **Data Source**: `prisma.blog.count()`

#### 2. Published
- **Icon**: Newspaper icon
- **Value**: Count of blogs with status "Published"
- **Label**: "Published"
- **Data Source**: `prisma.blog.count({ where: { status: "Published" } })`

#### 3. Draft
- **Icon**: Newspaper icon
- **Value**: Count of blogs with status "Draft"
- **Label**: "Draft"
- **Data Source**: `prisma.blog.count({ where: { status: "Draft" } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Published
- Draft

**Category Filter**:
- All Categories
- [Dynamically populated from blogs on current page]

**Author Filter**:
- All Authors
- [Dynamically populated from blog authors on current page]

### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search blogs..."
- **Searches**: Title, slug, category

### List View Table

**Columns**:
1. **#**: Sequential row number
2. **Thumbnail**: Blog thumbnail image or gradient placeholder
3. **Title**: Blog post title
4. **Slug**: URL slug of the blog
5. **Category**: Category name (or "—")
6. **Author**: Author full name (or "—")
7. **Status**: Badge (Green "Published" or Red "Draft")
8. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Thumbnail image (3:2 aspect ratio with hover zoom)
- Title
- Status badge
- Slug (truncated)
- Category (if exists)
- Author (if exists)
- Action buttons: View, Edit, Delete

### Add/Edit Blog Modal

**Modal Title**: "Add Blog" or "Edit Blog"

**Input Fields**:

1. **Title** (Text)
   - Type: Text input
   - Required: Yes
   - Auto-generates slug when creating

2. **Slug** (Text)
   - Type: Text input
   - Required: Yes
   - Auto-generated from title (editable)

3. **Content** (Rich Text Editor)
   - Type: Tiptap rich text editor
   - Required: No
   - Supports full formatting

4. **Category** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "e.g. Technology"

5. **Author** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: List of team members from Team table

6. **Read Time** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "e.g. 8 min read"

7. **Excerpt** (Textarea)
   - Type: Textarea (2 rows)
   - Required: No
   - Placeholder: "Short summary shown in blog cards..."

8. **Tags** (Tag Input)
   - Type: Type and press Enter to add tags
   - Required: No
   - Tags displayed as removable chips
   - Each tag is a separate entry

9. **Thumbnail** (Image Upload)
   - Type: Image upload via Uploadcare
   - Required: No

10. **Status** (Dropdown)
    - Type: Select dropdown
    - Required: Yes
    - Default: Draft
    - Options: Draft, Published

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Add Blog** / **Save Changes**: Saves blog and refreshes the list

### Delete Confirmation Modal

**Modal Title**: "Delete Blog"
**Message**: "Are you sure you want to delete this blog? This action cannot be undone."

### View Detail Modal

**Modal Title**: Blog title
**Shows**:
- Thumbnail image
- Title
- Slug
- Category
- Author
- Status
- Excerpt
- Tags (comma-separated)
- Read Time

---

## Pages Management

### Page Name
**Pages**

### Purpose
View and manage all website pages created through Website Setup → Add New Page. Pages are custom-built content pages for the website. New pages cannot be created from this section — they must be created via Website Setup → Add New Page.

### Header Section
- **Title**: "Pages"
- **Description**: "View all website pages. Add new pages from Website Setup → Add New Page."
- **Filter Button**: Opens dropdown with Status filter
- **No Add Button**: Pages are added via Website Setup → Add New Page

### Statistics Cards (3 cards)

#### 1. Total Pages
- **Icon**: File Text icon
- **Value**: Total count of all pages
- **Label**: "Total Pages"
- **Data Source**: `prisma.page.count()`

#### 2. Published
- **Icon**: File Text icon
- **Value**: Count of pages with status "Published"
- **Label**: "Published"
- **Data Source**: `prisma.page.count({ where: { status: "Published" } })`

#### 3. Drafts
- **Icon**: File Text icon
- **Value**: Count of pages with status "Draft"
- **Label**: "Drafts"
- **Data Source**: `prisma.page.count({ where: { status: "Draft" } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Published
- Draft

### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search pages..."
- **Searches**: Title, slug

### List View Table

**Columns**:
1. **#**: Sequential row number
2. **Thumbnail**: Page thumbnail or gradient placeholder
3. **Title**: Page title
4. **Slug**: URL slug (displayed as "/slug")
5. **Created**: Creation date (formatted as "DD MMM YYYY")
6. **Status**: Badge (Green "Published" or Yellow "Draft")
7. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Thumbnail or placeholder gradient with File icon
- Title
- Status badge
- Slug
- Created date
- Action buttons: View, Edit, Delete

### Edit Page Modal

**Modal Title**: "Edit Page"

**Input Fields** (based on PageEditModal component):
1. **Title** (Text) - Required
2. **Slug** (Text) - Required
3. **Content** (Rich Text Editor) - Optional, Tiptap editor
4. **Thumbnail** (Image Upload) - Optional
5. **Meta Title** (Text) - Optional, SEO
6. **Meta Description** (Text) - Optional, SEO
7. **Keywords** (Text) - Optional, SEO
8. **Meta Image** (Image Upload) - Optional, SEO
9. **Status** (Dropdown) - Options: Published, Draft

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Save Changes**: Updates page and refreshes the list

### Delete Confirmation Modal

**Modal Title**: "Delete Page"
**Message**: "Are you sure you want to delete this page? This action cannot be undone."

### View Detail Modal

**Modal Title**: Page title
**Shows**:
- Thumbnail
- Title
- Slug
- Meta Title
- Meta Description
- Status

---

## Category Management

### Page Name
**Category**

### Purpose
Manage content categories used to organize blogs, services, careers, and other content on the website.

### Header Section
- **Title**: "Category"
- **Description**: "Manage all your categories."
- **Filter Button**: Opens dropdown with Status filter
- **Add Category Button**: Opens the Add Category modal

### Statistics Cards (3 cards)

#### 1. Total Categories
- **Icon**: Tag icon
- **Value**: Total count of all categories
- **Label**: "Total Categories"
- **Data Source**: `prisma.category.count()`

#### 2. Active
- **Icon**: Check Circle icon
- **Value**: Count of categories with status "Active"
- **Label**: "Active"
- **Data Source**: `prisma.category.count({ where: { status: "Active" } })`

#### 3. Inactive
- **Icon**: X Circle icon
- **Value**: Count of categories with status "Inactive"
- **Label**: "Inactive"
- **Data Source**: `prisma.category.count({ where: { status: "Inactive" } })`

### Filter Dropdown
**Status Filter**:
- All Statuses
- Active
- Draft
- Inactive

### View Toggle
- **List View** (table icon)
- **Card View** (grid icon)

### Search Bar
- **Placeholder**: "Search categories..."
- **Searches**: Name, slug, parent category

### List View Table

**Columns**:
1. **#**: Sequential row number
2. **Icon**: Category icon image (or gradient placeholder with Tag icon)
3. **Category Name**: Name of the category
4. **Parent**: Parent category name (or "—")
5. **Slug**: URL slug (displayed as "/slug")
6. **Status**: Colored badge — Green "Active", Yellow "Draft", Red "Inactive"
7. **Updated**: Last updated date (DD MMM YYYY)
8. **Actions**: View, Edit, Delete buttons

### Card View Grid
- Banner image (if set), or gradient with icon
- Category name
- Status badge
- Parent (if set)
- Slug
- Action buttons: View, Edit, Delete

### Add/Edit Category Modal

**Modal Title**: "Add New Category" or "Edit Category"

**Input Fields**:

1. **Name** (Text)
   - Type: Text input
   - Required: Yes
   - Auto-generates slug when creating

2. **Slug** (Text)
   - Type: Text input
   - Required: Yes
   - Auto-generated from name (editable)

3. **Parent Category** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Options: None (Top Level), Services, Careers, Invoices, Blogs, Pages

4. **Order Number** (Number)
   - Type: Number input
   - Required: No
   - Used to sort categories in display

5. **Status** (Dropdown)
   - Type: Select dropdown
   - Required: Yes
   - Options: Active, Draft, Inactive

6. **Banner** (Image Upload)
   - Type: Image upload via Uploadcare
   - Required: No
   - Used as category banner image

7. **Icon** (Image Upload)
   - Type: Image upload via Uploadcare
   - Required: No
   - Used as small category icon

8. **Link** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "Category page URL"

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Add Category** / **Save Changes**: Saves and refreshes the list

### Delete Confirmation Modal

**Modal Title**: "Delete Category"
**Message**: "Are you sure you want to delete this category? This action cannot be undone."

### View Detail Modal

**Modal Title**: Category name
**Shows**:
- Banner or icon image
- Name
- Slug
- Parent
- Order number

---


## Website Setup

Website Setup is a sidebar group containing six subpages for managing the public-facing website's structure and content.

---

### Website Setup > Website Header

#### Page Name
**Website Header**

#### Purpose
Configure the website's navigation bar, top banner advertisement, sticky header behavior, and help phone number.

#### Fields

1. **Enable Sticky Header** (Toggle)
   - Type: Toggle switch
   - Description: Keeps the navbar fixed at the top of the page while the user scrolls
   - Default: depends on saved setting

2. **Topbar Banner Ad**
   - **Banner Image** (Image Upload): Image displayed above the navbar as a promotional banner
   - **Banner Link (URL)** (Text): URL the banner links to when clicked; Placeholder: "https://example.com/promo"

3. **Help Link Number** (Text)
   - Type: Text input
   - Description: Phone number shown in the navigation bar header
   - Placeholder: "9898989898"

4. **Navigation Menu** (Dynamic List)
   - Type: List of menu items, each with:
     - **Label** (Text): Display name of the menu item
     - **Path** (Text): URL path (e.g., /about)
   - Each menu item can have **sub-links (dropdown)**:
     - **Sub-label** (Text): Display name of dropdown item
     - **Sub-path** (Text): URL path for dropdown item
   - **Add Menu Link** button: Adds a new top-level menu item
   - **Add sub-link (dropdown)** button: Adds a child menu item under a parent
   - **Delete** (Trash icon): Removes a menu item or sub-link

#### Action Buttons (Sticky Header Bar)
- **Cancel**: Reverts all unsaved changes
- **Save Changes**: Saves all header settings to database
- Only appear when changes have been made

---

### Website Setup > Footer Widgets

#### Page Name
**Footer Widgets**

#### Purpose
Manage all content shown in the website footer including logo, brand description, navigation link columns, social links, app store links, and payment logos.

#### Section 1: Footer Branding
1. **Footer Logo** (Image Upload)
   - Type: Image upload
   - Logo displayed in the footer

2. **Brand Text** (Text)
   - Type: Text input
   - Company name/tagline next to the footer logo
   - Placeholder: "e.g. Going Genius Group of Companies"

3. **About Description** (Textarea)
   - Type: Textarea (3 rows)
   - Short company description shown in footer

#### Section 2: Footer Link Columns
- Dynamic list of link columns
- Each column has:
  - **Column Title** (Text): Section heading
  - **Links** (Dynamic list per column):
    - **Label** (Text): Link display text
    - **Href** (Text): Link path or URL
    - **Delete** (Trash icon): Remove link
  - **+ Add link**: Adds a link to the column
  - **Delete Column** (Trash icon): Removes the entire column
- **Add Column** button: Adds a new link column

#### Section 3: Footer Bottom
1. **Copyright Text** (Text)
   - Type: Text input
   - Copyright line displayed at the bottom of the footer

2. **Social Links** (Dynamic list)
   - Each entry has:
     - **Platform** (Dropdown): Facebook, Twitter, GitHub, WhatsApp, LinkedIn, Instagram, YouTube
     - **URL** (URL input): Social media profile URL
     - **Delete** (Trash icon): Removes the social link
   - **Add Social Link** button: Adds a new social link entry

#### Section 4: App Links
1. **Play Store Link** (URL)
   - Type: URL input
   - Link to the app on Google Play Store

2. **App Store Link** (URL)
   - Type: URL input
   - Link to the app on Apple App Store

#### Section 5: Payment Logos
- **Payment Logo** (Image Upload, multiple)
   - Type: Multi-image upload
   - Displays uploaded payment logos in a grid
   - Each logo has a delete button (visible on hover)

#### Action Buttons (Sticky Header Bar)
- **Cancel**: Reverts all unsaved changes
- **Save Changes**: Saves all footer settings

---

### Website Setup > Our Partners

#### Page Name
**Our Partners**

#### Purpose
Manage partner company logos that are displayed on the website's partners section.

**Implementation**: Stores an array of partner logo image URLs in the `settings` table under the key `"partners-logos"`.

#### Fields
- **Partner Logos** (Multiple Image Upload)
  - Type: Image upload (multiple)
  - Each uploaded logo is displayed in a grid
  - Each logo has a remove/delete button

#### Action Buttons
- **Save Changes**: Saves updated partner logos list

---

### Website Setup > Technologies

#### Page Name
**Technologies**

#### Purpose
Manage technology logos displayed on the website (showing the technologies the company uses or supports).

**Implementation**: Stores an array of technology logo image URLs in the `settings` table under the key `"technologies-logos"`.

#### Fields
- **Technology Logos** (Multiple Image Upload)
  - Type: Image upload (multiple)
  - Each uploaded logo displayed in a grid
  - Each logo has a remove/delete button

#### Action Buttons
- **Save Changes**: Saves updated technology logos list

---

### Website Setup > FAQ

#### Page Name
**FAQ**

#### Purpose
Manage frequently asked questions displayed on the website.

**Implementation**: Reads from and writes to the `faq` table in the database, ordered by the `order` column.

#### Features
- Add new FAQ entries
- Edit existing questions and answers
- Delete FAQ entries
- Reorder FAQ items

#### Fields (per FAQ entry)
- **Question** (Text): The FAQ question
- **Answer** (Textarea/Rich Text): The FAQ answer
- **Order** (Number): Display order

#### Action Buttons
- **Add FAQ**: Adds a new FAQ entry
- **Save/Edit**: Updates existing entries
- **Delete**: Removes an FAQ entry

---

### Website Setup > Add New Page

#### Page Name
**Add New Page**

#### Purpose
Create new custom pages for the website. Once created, the page appears in the Pages section and can optionally be added to the website navigation menu.

#### Section 1: Page Content

1. **Title** (Text)
   - Type: Text input
   - Required: Yes
   - Auto-generates Slug and Menu Label

2. **Slug** (Text)
   - Type: Text input
   - Required: Yes
   - Auto-generated from title (editable)
   - URL-friendly: lowercase, hyphens

3. **Page Thumbnail** (Image Upload)
   - Type: Image upload
   - Required: No

4. **Content** (Rich Text Editor)
   - Type: Tiptap rich text editor
   - Required: No
   - Supports headings, bold, italic, lists, images, etc.
   - Note: H2 headings auto-create entries in the "On this page" sidebar

5. **Status** (Dropdown)
   - Type: Select dropdown
   - Default: Draft
   - Options: Draft, Published

#### Section 2: Navigation Menu

6. **Add to Navigation Menu** (Checkbox)
   - Type: Checkbox
   - When checked, reveals menu label and route fields

7. **Menu Label** (Text, conditional)
   - Type: Text input
   - Shown only when "Add to Navigation Menu" is checked
   - Auto-populated from Title
   - The text shown in the navbar

8. **Route** (Read-only)
   - Type: Disabled text input
   - Shows the computed URL path (e.g., /terms-and-conditions)

#### Section 3: SEO Fields

9. **Meta Title** (Text)
   - Type: Text input
   - Max: 60 characters (counter shown)
   - Recommended: 50–60 characters

10. **Meta Description** (Text)
    - Type: Text input
    - Max: 160 characters (counter shown)
    - Recommended: 150–160 characters

11. **Keywords** (Text)
    - Type: Text input
    - Comma-separated keywords

12. **Meta Image** (Image Upload)
    - Type: Image upload
    - Used for social media sharing previews

#### Action Buttons (Sticky Header Bar)
- **Cancel**: Resets all form fields
- **Create Page**: Creates the page in the database, optionally adds to navigation, then redirects to /pages

---


## Settings

The Settings section is accessible from the sidebar bottom. Visiting `/settings` automatically redirects to `/settings/general`. The settings layout contains a sub-navigation sidebar with links to all settings subpages.

---

### Settings > General

#### Page Name
**General Settings**

#### Purpose
Configure the website's basic identity: site name, logo, favicon, theme color, text color, site description, and meta keywords.

#### Fields

1. **Site Logo** (Image Upload)
   - Type: Image upload via Uploadcare
   - Required: No
   - The main logo used across the website

2. **Favicon** (Image Upload)
   - Type: Image upload via Uploadcare
   - Required: No
   - Small icon shown in browser tab

3. **App/Site Title** (Text)
   - Type: Text input
   - Required: Yes (marked with *)
   - The site name shown in the browser title and emails

4. **Default Theme Color** (Color Picker)
   - Type: Color picker + text input
   - The primary brand color for the website (buttons, highlights, links)
   - When changed, automatically updates the Theme Text Color to the best-contrast option

5. **Default Text Color** (Color Picker)
   - Type: Color picker + text input
   - Text color used on top of the theme color (buttons, badges, banners)
   - Shows a recommended color button if current choice is not optimal contrast
   - Smart contrast recommendation using the `getReadableTextColor` utility

6. **Preview** (Live preview, read-only)
   - Shows a live preview of the theme color, text color, and site name together
   - Shows a sample "Button" element with inverted colors

7. **Description** (Textarea)
   - Type: Textarea
   - Max: 160 characters (counter shown)
   - Site description used as meta description fallback

8. **Meta Keywords** (Text)
   - Type: Text input
   - Global meta keywords for the site

9. **Website Base Color** (Toggle)
   - Type: Toggle switch
   - Enables or disables the base color being applied to the website
   - Default: depends on saved setting

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves all general settings

---

### Settings > Contact

#### Page Name
**Contact Settings**

#### Purpose
Manage public-facing contact information shown on the website's contact page and used in invoice print headers.

#### Fields

1. **Phone No 1** (Phone)
   - Type: Tel input
   - Required: Yes
   - Validation: Must include country code (e.g., +977 9800000000)
   - Filters: Allows only digits, +, spaces, hyphens, parentheses

2. **Phone No 2** (Phone)
   - Type: Tel input
   - Required: No
   - Same validation as Phone No 1

3. **Email Address 1** (Email)
   - Type: Email input
   - Required: Yes
   - Validation: Must be valid email format

4. **Email Address 2** (Email)
   - Type: Email input
   - Required: No
   - Same validation as Email 1

5. **Address** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "Kathmandu, Nepal"

6. **Contact Mail** (Email)
   - Type: Email input
   - Required: Yes
   - This email receives messages from the website's contact form

7. **Office Hours** (Text)
   - Type: Text input
   - Required: No
   - Placeholder: "Monday to Friday 9:00am - 6:00pm"

8. **Google Map Embed Code** (Textarea)
   - Type: Textarea
   - Required: No
   - Accepts `<iframe>` embed code from Google Maps

9. **Google Map Preview** (Live Preview, read-only)
   - Renders a live preview of the embedded map
   - Shows placeholder text when embed code is empty

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves all contact settings

---

### Settings > Appearance

#### Page Name
**Appearance Settings**

#### Purpose
Manage the website's hover color, toggle hover color on/off, and set the system timezone.

#### Fields

1. **Website Base Color** (Color Display, read-only)
   - Type: Color swatch + text (disabled)
   - Synced from General Settings theme color
   - Cannot be edited here; links to General Settings

2. **Website Hover Color** (Color Picker)
   - Type: Color picker + text input
   - Color applied when hovering over buttons, cards, and links
   - Editable only when "Enable Hover Color" is on

3. **Enable Hover Color** (Toggle)
   - Type: Toggle switch
   - When disabled, hovering keeps the base color (no color change)

4. **System Timezone** (Dropdown)
   - Type: Select dropdown
   - ~27 timezone options from GMT-12:00 to GMT+12:00
   - Examples: UTC, GMT+05:30 Mumbai/New Delhi, GMT+05:45 Asia/Kathmandu

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves appearance settings

---

### Settings > SEO

#### Page Name
**Global SEO Settings**

#### Purpose
Configure global/default SEO meta tags that apply site-wide unless overridden by individual pages.

#### Fields

1. **Meta Title** (Text)
   - Type: Text input
   - The default `<title>` tag used site-wide

2. **Meta Description** (Text)
   - Type: Text input
   - The default meta description used site-wide

3. **Meta Keywords** (Textarea, 1 row)
   - Type: Textarea (resized to 1 row)
   - Comma-separated keywords

4. **Meta Image** (Image Upload)
   - Type: Image upload via Uploadcare
   - Recommended: 1200×630px (Max 2MB)
   - Used as the default Open Graph / social sharing image

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves SEO settings

---

### Settings > Social

#### Page Name
**Social Settings**

#### Purpose
Configure the company's social media profile URLs displayed on the website.

#### Fields (all optional, URL validation)

1. **Facebook** (URL)
   - Placeholder: "https://facebook.com/..."
   - Icon: Facebook (blue)

2. **Twitter URL** (URL)
   - Placeholder: "https://twitter.com/..."
   - Icon: X/Twitter

3. **LinkedIn URL** (URL)
   - Placeholder: "https://linkedin.com/..."
   - Icon: LinkedIn (blue)

4. **Instagram URL** (URL)
   - Placeholder: "https://instagram.com/..."
   - Icon: Instagram (pink)

5. **Pinterest URL** (URL)
   - Placeholder: "https://pinterest.com/..."
   - Icon: Pinterest (red)

6. **YouTube URL** (URL)
   - Placeholder: "https://youtube.com/..."
   - Icon: YouTube (red)

7. **WhatsApp No** (Text)
   - Type: Phone number text input
   - Placeholder: "+1 234 567 890"
   - Validation: Minimum 5 characters

**Validation**: All URL fields must start with `https://` if filled. Empty fields are allowed (optional).

**Note**: A "Move to website/footer" icon link appears next to the page title, linking to the Footer Widgets page where social links can also be managed.

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves social settings

---

### Settings > Security

#### Page Name
**Security Settings**

#### Purpose
Manage authentication and access security settings.

#### Fields

1. **Two-Factor Authentication** (Toggle)
   - Type: Toggle switch
   - Description: "Send OTP to email on login"
   - Enables or disables 2FA

2. **Session Timeout** (Dropdown)
   - Type: Select dropdown
   - Description: "Auto logout after inactivity (minutes)"
   - Options: 15 min, 30 min, 1 hour, 2 hours

3. **Login Attempts** (Dropdown)
   - Type: Select dropdown
   - Description: "Max failed attempts before lockout"
   - Options: 3 attempts, 5 attempts, 10 attempts

4. **Password Min Length** (Dropdown)
   - Type: Select dropdown
   - Description: "Minimum characters required"
   - Options: 6 chars, 8 chars, 10 chars, 12 chars

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves security settings

---

### Settings > Email

#### Page Name
**Email Settings**

#### Purpose
Configure the SMTP email server settings for sending automated emails from the system (contact form responses, notifications, etc.).

#### Fields

1. **Email sent from address** (Email)
   - Type: Email input
   - The "From" email address on outgoing emails
   - Placeholder: "noreply@company.com"

2. **Email sent from name** (Text)
   - Type: Text input
   - The "From" name on outgoing emails
   - Placeholder: "Going Genius"

3. **SMTP Host** (Text)
   - Type: Text input
   - Placeholder: "smtp.gmail.com"

4. **SMTP User** (Text)
   - Type: Text input
   - Placeholder: "user@gmail.com"

5. **SMTP Password** (Password)
   - Type: Password input (masked)
   - Placeholder: "••••••••"

6. **SMTP Port** (Text)
   - Type: Text input
   - Placeholder: "587"

7. **Security Type** (Dropdown)
   - Type: Select dropdown
   - Options: None, SSL, TLS

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves email/SMTP settings

---

### Settings > Cookies

#### Page Name
**Cookies Settings**

#### Purpose
Configure the cookie consent banner displayed to website visitors.

#### Fields

1. **Cookies Agreement** (Toggle)
   - Type: Toggle switch
   - Enables or disables cookie tracking/agreement logic

2. **Cookies Agreement Text** (Textarea)
   - Type: Textarea (4 rows)
   - The text shown in the cookie consent banner
   - Placeholder: "We use cookies to improve your experience..."

3. **Show Cookies Agreement?** (Toggle)
   - Type: Toggle switch
   - Controls whether the cookie consent banner is shown to visitors

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts to last saved values
- **Save Changes**: Saves cookie settings

---

### Settings > Popup (Website Popup Settings)

#### Page Name
**Website Popup Settings**

#### Purpose
Configure an optional popup modal shown to website visitors. Supports rich text content and image slides with clickable links.

#### Fields

1. **Show website popup?** (Toggle)
   - Type: Toggle switch
   - Enables or disables the popup for website visitors

2. **Popup Content** (Rich Text Editor)
   - Type: Tiptap rich text editor
   - Optional text, formatting, and embedded images for the popup body
   - Placeholder: "Write popup content..."

3. **Popup Images with Links** (Dynamic Image Slides)
   - **Add Image** button: Adds a new slide entry
   - Each slide contains:
     - **Image** (Image Upload via Uploadcare): The slide image
     - **Link URL** (URL, optional): Where the visitor is redirected when clicking the image
     - **Delete** (Trash icon): Removes this slide
   - Empty state shows: "No images added yet. Click 'Add Image' to start."

#### Action Buttons (Sticky Header Bar, appears only when changes exist)
- **Cancel**: Reverts all unsaved changes
- **Save Changes**: Saves popup settings

---

## Global Navigation & Layout

### Sidebar

The sidebar is the primary navigation element of the admin panel.

**Contents**:
- **Logo**: "Going Genius" with "Group of Companies" subtitle
- **User Profile**: Shows logged-in user's name, email, and role badge (Administrator with Crown icon for admin users)
- **Navigation Links** (main items listed above, in order):
  1. Dashboard
  2. Customer
  3. Projects
  4. Team
  5. Services
  6. Careers
  7. Analytics
  8. Invoices
  9. Blog
  10. Pages
  11. Category
  12. Website Setup (expandable group with 6 sub-items)
  13. Settings (at bottom, below divider)
- **Logout Button** (red, at bottom): Opens logout confirmation modal

**Behavior**:
- Active link highlighted in orange (#e8821a)
- Website Setup expands/collapses to show sub-items
- On mobile: sidebar is a drawer that slides in from the left
- On desktop: sidebar is always visible on the left

### Logout Confirmation Modal

**Modal Title**: "Confirm Logout"
**Message**: "Are you sure you want to log out? You will need to sign in again to access the dashboard."

**Action Buttons**:
- **Cancel**: Closes modal
- **Logout** (red button): Signs out and redirects to /login

### Topbar

Each admin page includes a `<Topbar>` component at the top. The topbar has `showSearch={false}` on most pages, meaning the search bar is hidden. The topbar primarily provides layout spacing and may show a user avatar or notification area.

---

## Authentication Pages

### Login Page
- **Route**: `/login`
- Admin signs in with email and password

### Onboarding Page
- **Route**: `/onboarding`
- First-time setup for new admin credentials
- After completing onboarding, the admin is automatically signed out and must re-authenticate
- **Title**: "Welcome, Admin"
- **Purpose**: Set up new credentials to secure the account



---

## Corrections & Additional Detail

The following sections update or expand on earlier documentation with accurate details discovered during full code review.

---

### Website Setup > Our Partners (Full Detail)

#### Additional Detail
- **Title**: "Our Partners"
- **Description**: "Manage partner company logos displayed on the website."
- The upload section supports **multiple uploads** in a single session via the ImageUploader component.
- Each logo in the grid has a hover overlay with two actions:
  - **Change**: Replaces a specific logo (puts the uploader into replace mode for that index)
  - **Delete (Trash icon)**: Removes the logo from the list immediately
- Partners counter: "Added Partners (N)" shown in the list card header.
- **Save Changes** button is sticky on mobile (pinned to the bottom of the screen).

---

### Website Setup > Technologies Used (Full Detail)

#### Additional Detail
- **Title**: "Technologies Used"
- **Description**: "Manage technology logos displayed on the website."
- Each logo in the grid has a hover overlay with two actions:
  - **Change**: Replaces a specific technology logo
  - **Delete (Trash icon)**: Removes the logo AND **auto-saves** to the database immediately (unlike Partners which requires a manual Save)
- Technologies counter: "Added Technologies (N)" shown in the list card header.
- **Save Changes** button is sticky on mobile.

---

### Website Setup > FAQ (Full Detail)

#### Page Title
**FAQ**

#### Description
"Manage frequently asked questions displayed on the website."

#### Add New FAQ Section (form card)

**Input Fields**:

1. **Question** (Text)
   - Type: Text input
   - Required: Yes (button is disabled if empty)
   - Placeholder: "e.g. What services do you offer?"

2. **Answer** (Textarea)
   - Type: Textarea (3 rows)
   - Required: No
   - Placeholder: "Write the answer here..."

3. **Category** (Dropdown)
   - Type: Select dropdown
   - Required: No
   - Default: General
   - Options: General, Services, Pricing, Support

**Action Buttons**:
- **Add FAQ** (amber button with Plus icon): Creates the FAQ and refreshes the list

#### FAQ List Card

- **Header**: "All FAQs (N)" — shows total count
- **Empty State**: Shows HelpCircle icon with "No FAQs yet. Add one above."
- **Each FAQ row** shows:
  - Question text (truncated)
  - Category badge
  - First 60 characters of the answer
  - **Delete button** (Trash icon, red) — instantly deletes the FAQ
  - **Expand chevron** (ChevronDown/ChevronUp) — toggles the inline edit panel

#### Inline Edit Panel (expanded per FAQ)

When a FAQ row is expanded, an inline form appears below it:

1. **Question** (Text): Editable text input
2. **Answer** (Textarea, 3 rows): Editable textarea
3. **Category** (Dropdown): Options: General, Services, Pricing, Support

**Action Buttons**:
- **Save** (amber button): Updates the FAQ in place. Shows "Saved!" confirmation text briefly.

---

### Settings Navigation (Full Sidebar)

The Settings section uses a dedicated `SettingsNav` component that appears as:
- **Desktop**: Vertical sidebar on the left (width: 52/208px), with a "Settings" heading
- **Mobile**: Horizontal scrollable tab row at the top, with a scroll-right button if overflow exists

**Settings Sub-Navigation Links** (in order):
1. **General** (icon: SlidersHorizontal) → `/settings/general`
2. **Contact** (icon: Phone) → `/settings/contact`
3. **Email** (icon: Mail) → `/settings/email`
4. **Social** (icon: Share2) → `/settings/social`
5. **Security** (icon: Shield) → `/settings/security`
6. **Appearance** (icon: Paintbrush) → `/settings/appearance`
7. **SEO** (icon: Search) → `/settings/seo`
8. **Popup** (icon: LayoutTemplate) → `/settings/popup`
9. **Cookies** (icon: Cookie) → `/settings/cookies`

Active item is highlighted in amber (orange-yellow), with a left border on desktop and bottom border on mobile.

---

### Pages > Edit Page Modal (Full Detail)

**Modal Title**: "Edit Page"

**Input Fields**:

1. **Title** (Text)
   - Type: Text input
   - Required: Yes

2. **Slug** (Text)
   - Type: Text input
   - Required: Yes

3. **Content** (Rich Text Editor)
   - Type: Tiptap rich text editor
   - Required: No

4. **Thumbnail** (Image Upload)
   - Type: Image upload via Uploadcare
   - Required: No

5. **Status** (Dropdown)
   - Type: Select dropdown
   - Options: Draft, Published

6. **SEO Section** (collapsible group, separated by a horizontal divider):
   - **Meta Title** (Text) — max 60 characters
   - **Meta Description** (Text) — max 160 characters
   - **Keywords** (Text) — comma-separated
   - **Meta Image** (Image Upload)

**Action Buttons**:
- **Cancel**: Closes modal without saving
- **Save Changes**: Updates page and refreshes the list

---

## Authentication Pages (Full Detail)

### Login Page

- **Route**: `/login`
- **Title**: "Sign in"
- **Subtitle**: "Enter your credentials to access the CMS"

**Input Fields**:

1. **Email** (Email)
   - Type: Email input
   - Required: Yes
   - Validation: Zod schema via `loginSchema`
   - Auto-complete: email

2. **Password** (Password)
   - Type: Password input (masked)
   - Required: Yes
   - Auto-complete: current-password

**Action Buttons**:
- **Sign in** (full-width button): Submits credentials via NextAuth `signIn("credentials")`
- Shows "Signing in…" while submitting

**Error handling**:
- Displays "Invalid email or password" banner on failed login
- Field-level validation errors shown below each input

**Redirect behavior**:
- On success, redirects to `callbackUrl` query param, defaulting to `/dashboard`
- Middleware may redirect to `/onboarding` if first-time setup is needed

---

### Onboarding Page

- **Route**: `/onboarding`
- **Title**: "Welcome, Admin"
- **Subtitle**: "Set up your new credentials to secure your account"
- **Warning Banner**: "Important: After saving, you will be logged out and must sign in again with your new email and password. The default credentials will no longer work."

**Input Fields**:

1. **New Email Address** (Email)
   - Type: Email input
   - Required: Yes
   - Validation: Must be valid email format

2. **New Password** (Password)
   - Type: Password input (masked)
   - Required: Yes
   - Validation rules (all required):
     - Minimum 8 characters
     - At least 1 uppercase letter
     - At least 1 number
     - At least 1 special character
   - Hint text: "Min 8 characters, 1 uppercase, 1 number, 1 special character"

3. **Confirm Password** (Password)
   - Type: Password input (masked)
   - Required: Yes
   - Validation: Must match New Password

**Action Buttons**:
- **Save & Continue** (full-width button): Saves new credentials
- Shows "Saving…" while submitting

**Post-submit behavior**:
- Shows a success card with a green ShieldCheck icon: "Credentials Updated"
- After 2 seconds, automatically calls `signOut()` and redirects to `/login`
- Admin must then sign in with the new credentials

---

## Prisma Data Model Summary

The following tables are used by the admin panel (inferred from server actions and page files):

| Table | Used By |
|-------|---------|
| `project` | Projects / Dashboard |
| `customer` | Customers / Dashboard |
| `team` | Team / Blog (authors) |
| `service` | Services / Customers / Projects |
| `invoice` | Invoices / Dashboard |
| `blog` | Blog |
| `page` | Pages / Add New Page |
| `category` | Category |
| `faq` | Website Setup > FAQ |
| `jobVacancy` | Careers |
| `generalSetting` | Settings > General / Invoices (print) |
| `contactSetting` | Settings > Contact / Invoices (print) |
| `appearanceSetting` | Settings > Appearance |
| `seoSetting` | Settings > SEO |
| `emailSetting` | Settings > Email |
| `securitySetting` | Settings > Security |
| `cookieSetting` | Settings > Cookies |
| `popupSetting` | Settings > Popup |
| `setting` | Website Setup > Partners / Technologies |
| `websiteHeader` | Website Setup > Header |
| `footerSetting` | Website Setup > Footer Widgets |
| `socialLink` | Settings > Social |

---

## Common UI Patterns

The following patterns appear consistently throughout the admin panel:

### Row Actions (RowActions component)

Every table row and card has action buttons:
- **View** (Eye icon): Opens the View Detail Modal with read-only field display
- **Edit** (Pencil/Edit icon): Opens the Add/Edit modal pre-filled with current data
- **Delete** (Trash icon): Opens the Delete Confirmation Modal
- **Print** (Printer icon, Invoices only): Opens the Print Invoice Modal

On desktop these appear as icon buttons in a row. On mobile they appear as labeled text buttons.

### Pagination (Pagination component)

- Shows page navigation with previous/next arrows and page number buttons
- Range label: "Showing X to Y of Z entries"
- Page size: 10 records per page on all list pages
- Only shown when total records exceed one page (pageCount > 1)

### Delete Confirmation Modal (DeleteConfirmModal component)

Appears on every delete action across all pages. Always contains:
- A title specific to what is being deleted
- A message warning the action cannot be undone
- **Cancel** button (gray): Closes modal, no action
- **Delete/Confirm** button (red): Executes the deletion

### View Detail Modal (ViewDetailModal component)

Read-only display modal showing all fields for a selected record. Always contains:
- Optional header image
- Title (typically the name/title of the record)
- A list of labeled field-value pairs
- **Close** (X) button

### Save Behavior (Sticky Header Bars in Settings pages)

All Settings and Website Setup pages use a **sticky header bar** pattern:
- The bar only shows Save/Cancel buttons when unsaved changes are detected
- A `baseline` state tracks the last-saved values
- On successful save, the baseline is updated so the buttons disappear
- On cancel, all fields reset to baseline values

### Image Upload (ImageUploader / Uploadcare)

All image uploads across the admin panel use **Uploadcare** as the file hosting service. Uploaded images are stored as CDN URLs. The `ImageUploader` component wraps the Uploadcare widget and provides a consistent UI across all pages.

