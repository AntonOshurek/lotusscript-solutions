<div class="detail-content">
  <div class="detail-actions">
    <button type="button">Action 1</button>
    <button type="button">Action 2</button>
    <button type="button">Action 3</button>
  </div>

  <div
    class="detail-grid"
    data-ref="eDetailGrid"
  ></div>
</div>


      :host {
  display: block;
  height: 100%;
}

.detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-actions {
  display: flex;
  gap: 8px;
  padding: 16px 24px 0;
}

.detail-grid {
  flex: 1;
  min-height: 0;
  margin: 16px 24px 24px;
}
