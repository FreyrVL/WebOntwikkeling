document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {

        //Mobile
        const card = editBtn.closest(".card");
        if (card) {
            const view = card.querySelector(".view-mode");
            const edit = card.querySelector(".edit-mode");

            if (view && edit) {
                view.classList.add("hidden");
                edit.classList.remove("hidden");
            }

            return;
        }

        //Desktop
        const row = editBtn.closest(".view-row");
        if (row) {
            const editRow = row.nextElementSibling;

            row.classList.add("hidden");
            editRow.classList.remove("hidden");
        }
    }

    //Cancel the edit
    const cancelBtn = e.target.closest(".cancel-btn");
    if (cancelBtn) {

        const card = cancelBtn.closest(".card");
        if (card) {
            card.querySelector(".edit-mode").classList.add("hidden");
            card.querySelector(".view-mode").classList.remove("hidden");
            return;
        }

        const editRow = cancelBtn.closest("tr");
        if (editRow) {
            const viewRow = editRow.previousElementSibling;

            editRow.classList.add("hidden");
            viewRow.classList.remove("hidden");
        }
    }

});