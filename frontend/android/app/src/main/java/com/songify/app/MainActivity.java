package com.songify.app;

import android.os.Bundle;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WebView webView = (WebView) this.bridge.getWebView();
    webView.addJavascriptInterface(new AudioLoader(), "AndroidAudio");
  }

  public class AudioLoader {
    @JavascriptInterface
    public String getAudioFiles() {
      JSONArray files = new JSONArray();
      Uri uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;

      String[] projection = {
        MediaStore.Audio.Media.DISPLAY_NAME,
        MediaStore.Audio.Media.DATA
      };

      Cursor cursor = getContentResolver().query(uri, projection, null, null, null);

      if (cursor != null) {
        while (cursor.moveToNext()) {
          try {
            JSONObject file = new JSONObject();
            file.put("name", cursor.getString(0));
            file.put("path", "file://" + cursor.getString(1));
            files.put(file);
          } catch (Exception e) {
            e.printStackTrace();
          }
        }
        cursor.close();
      }

      return files.toString();
    }
  }
}
