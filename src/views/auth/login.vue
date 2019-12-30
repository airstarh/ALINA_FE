<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="row align-items-center h-100">
                    <div class="col-md-6 mx-auto">
                        <form action="" method="post" enctype="multipart/form-data">
                            <h1>Login</h1>
                            <input type="text" name="mail" value="<?= $data->mail ?>" placeholder="Mail" class="form-control">
                            <input type="password" name="password" value="<?= $data->password ?>" placeholder="Password" class="form-control">
                            <input type="hidden" name="form_id" value="login" placeholder="Password" class="form-control">
                            <StandardButtons></StandardButtons>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
<script>
    // @ is an alias to /src
    import StandardButtons from "@/components/elements/form/StandardButtons";

    export default {
        name:       "home",
        components: {
            StandardButtons
        }
    };
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
