import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        // Add any properties you use globally on `this`
        routerTaleId?: string | number | null;
        ajaxGetTale?: function;
        taleLastTouchedRemember?: function;
        taleLastTouchedRecall?: function;
        // Add others as needed:
        // isLoading?: boolean;
        // someHelper?: () => void;
    }
}
