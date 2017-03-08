package com.hoomanlogic.democracy;

import android.content.Intent;
import com.facebook.react.ReactActivity;

import java.io.IOException;

public class MainActivity extends ReactActivity {
    SqlDataStore mDb;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "democracy";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    protected MainActivity() {
        super();
        mDb = new SqlDataStore(this.getBaseContext());
        try {
            mDb.initialize();
        }
        catch (IOException e) {
            throw new Error(e.getMessage());
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mDb.close();
    }
}
