import { reactive } from 'vue';

type LoaderStore = {
  isLoading: boolean;
};

export default reactive<LoaderStore>({
  isLoading: false,
});
