document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseDateInput = document.getElementById('expense-date');
    const expenseCategoryInput = document.getElementById('expense-category');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expensesTableBody = document.getElementById('expenses-table-body');
    const totalExpenseDisplay = document.getElementById('total-expense');
    const topCategoriesList = document.getElementById('top-categories-list');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Set today's date as default for the date input
    expenseDateInput.value = new Date().toISOString().slice(0, 10);

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function renderExpenses() {
        expensesTableBody.innerHTML = ''; // Clear existing list
        expenses.forEach(expense => {
            const row = expensesTableBody.insertRow();
            row.dataset.id = expense.id; // Store ID for easy deletion

            row.insertCell().textContent = expense.date;
            row.insertCell().textContent = expense.category;
            row.insertCell().textContent = parseFloat(expense.amount).toFixed(2);
            row.insertCell().textContent = expense.description;

            const actionsCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteExpense(expense.id));
            actionsCell.appendChild(deleteButton);
        });
        calculateTotalExpense();
        renderTopCategories();
    }

    function calculateTotalExpense() {
        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        totalExpenseDisplay.textContent = `$${total.toFixed(2)}`;
    }

    function renderTopCategories() {
        topCategoriesList.innerHTML = ''; // Clear existing list

        if (expenses.length === 0) {
            topCategoriesList.innerHTML = '<p class="no-data">No expenses recorded yet.</p>';
            return;
        }

        const categoryTotals = {};
        expenses.forEach(expense => {
            const category = expense.category.trim().toLowerCase();
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount);
        });

        // Convert object to array, sort, and get top 10
        const sortedCategories = Object.entries(categoryTotals)
            .map(([category, total]) => ({ category: category, total: total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10); // Get top 10

        if (sortedCategories.length === 0) {
            topCategoriesList.innerHTML = '<p class="no-data">No category data available.</p>';
            return;
        }

        sortedCategories.forEach(item => {
            const div = document.createElement('div');
            const categorySpan = document.createElement('span');
            categorySpan.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1); // Capitalize first letter
            const totalSpan = document.createElement('span');
            totalSpan.textContent = `$${item.total.toFixed(2)}`;

            div.appendChild(categorySpan);
            div.appendChild(totalSpan);
            topCategoriesList.appendChild(div);
        });
    }

    function addExpense(e) {
        e.preventDefault();

        const newExpense = {
            id: Date.now(), // Unique ID
            date: expenseDateInput.value,
            category: expenseCategoryInput.value.trim(),
            amount: parseFloat(expenseAmountInput.value),
            description: expenseDescriptionInput.value.trim()
        };

        expenses.push(newExpense);
        saveExpenses();
        renderExpenses();
        expenseForm.reset();
        expenseDateInput.value = new Date().toISOString().slice(0, 10); // Reset date to today
    }

    function deleteExpense(id) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        renderExpenses();
    }

    expenseForm.addEventListener('submit', addExpense);

    // Initial render when the page loads
    renderExpenses();
});