    const form = document.getElementById("filterSort");
    const searchInput = document.getElementById("searchInput");
    const sortBy = document.getElementById("sortBy");
    const order = document.getElementById("order");

    sortBy.addEventListener("change", () => {
        form.submit();
    });

    order.addEventListener("change", () => {
        form.submit();
    });
