<script lang="ts">
	import { auth } from "$lib/api/firebase";
	import { onMount } from "svelte";

	onMount(async () => {
		//const user = auth.currentUser;

		//if (!user) return;
		await fetch("/api/v1/get_pools", {
			headers: {
				auth_token:
					" eyJhbGciOiJSUzI1NiIsImtpZCI6IjJkOWI0ZTY5ZTMyYjc2MTVkNGNkN2NhZmI4ZmM5YjNmODFhNDFhYzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYml0Y2FtcC0yMDI0LTg5YWQxIiwiYXVkIjoiYml0Y2FtcC0yMDI0LTg5YWQxIiwiYXV0aF90aW1lIjoxNzEzNjI5OTcyLCJ1c2VyX2lkIjoidVFtbVRpeTBoRWFJa0hNVVJpdUFYQmlpQXFqMiIsInN1YiI6InVRbW1UaXkwaEVhSWtITVVSaXVBWEJpaUFxajIiLCJpYXQiOjE3MTM2Mjk5NzIsImV4cCI6MTcxMzYzMzU3MiwiZW1haWwiOiJ0ZXN0QGluZy5jbyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0QGluZy5jbyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.hrZ-12MJytU9X00PvUDSITdRo5h1QEm961egcaiUKNJcOX2upFjWKDGF9Ho6uXZu2tq8HoBEfdSX40fEKJ4vW3eVh7WBKwOLez6QgIUxXEUvW3MsCoKbluQjDmpRLHxbTdKPMnSs5VnCxcPa-rKB7hf1JAEEbg9VV8ruSvSe1xWGwYzgIwwcKD4WDfIi_swsvtSX8CiEOdowxwh_pWjI6PAs3j2P0OwADLQW0mDiKfJvCc933H4TX1kLg8qcbYtt-eiNgDCnlIp3XjnjlhDVQKbONV43kmujgEygHVAVgEz_3Lyhtn_pQ7_jvlXycb_EgOq_15sCE66IlBg5X29zIQ",
			},
		});
	});
</script>
