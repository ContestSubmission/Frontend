<script lang="ts">
    import {pageName} from "$lib/page_props";
    import {afterNavigate} from "$app/navigation";

    function setPageName() {
        pageName.set("Search Contest");
    }

    afterNavigate(setPageName)
    setPageName();
</script>
